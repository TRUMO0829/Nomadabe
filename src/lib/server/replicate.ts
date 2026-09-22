/**
 * Minimal Replicate client for the admin's text generation.
 *
 * The model is an environment variable, not a constant, so the admin can
 * switch between qwen, deepseek, claude or anything else Replicate hosts
 * without a code change. That is also why the request is written to the
 * lowest common denominator of their input schemas — prompt, system_prompt,
 * max_tokens, temperature — and why the output is read defensively: some
 * models return one string, others an array of chunks to join.
 */

const REPLICATE_API = "https://api.replicate.com/v1/models";
const DEFAULT_MODEL = "qwen/qwen3-235b-a22b-instruct-2507";

/**
 * Generous because a model that has not run recently cold-starts, and the
 * admin calls this once or twice a month — so every call is a cold start.
 */
const REQUEST_TIMEOUT_MS = 180_000;

type ReplicatePrediction = {
  id?: string;
  status?: string;
  output?: unknown;
  error?: unknown;
  detail?: string;
};

export function getReplicateModel() {
  return (process.env.REPLICATE_MODEL || DEFAULT_MODEL).trim().replace(/^\/+|\/+$/g, "");
}

export function isReplicateConfigured() {
  return Boolean(process.env.REPLICATE_API_TOKEN?.trim());
}

export function getReplicateSetupMessage() {
  return "REPLICATE_API_TOKEN тохируулаагүй байна. Vercel Project Settings > Environment Variables дээр нэмээд redeploy хийнэ үү.";
}

/**
 * Runs the configured model and returns its text. Uses `Prefer: wait` so the
 * request blocks until the prediction finishes instead of returning an id to
 * poll — one round trip, and the caller already has a long timeout.
 */
export async function runReplicateText({
  system,
  prompt,
  maxTokens = 2000,
  temperature = 0.3,
}: {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const token = process.env.REPLICATE_API_TOKEN?.trim();

  if (!token) {
    throw new Error(getReplicateSetupMessage());
  }

  const model = getReplicateModel();

  if (!/^[\w.-]+\/[\w.-]+$/.test(model)) {
    throw new Error(
      `REPLICATE_MODEL буруу байна: „${model}“. owner/name хэлбэрээр бичнэ үү (жишээ: ${DEFAULT_MODEL}).`
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(`${REPLICATE_API}/${model}/predictions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        input: {
          prompt,
          system_prompt: system,
          max_tokens: maxTokens,
          temperature,
        },
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Replicate ${Math.round(REQUEST_TIMEOUT_MS / 1000)} секундэд хариу өгсөнгүй. Загвар унтарсан байж магадгүй — дахин оролдоно уу.`
      );
    }

    throw new Error(`Replicate рүү холбогдож чадсангүй: ${getMessage(error)}`);
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json().catch(() => null)) as ReplicatePrediction | null;

  if (!response.ok) {
    const detail = payload?.detail || (payload?.error ? String(payload.error) : "");
    throw new Error(
      `Replicate алдаа (${response.status})${detail ? `: ${detail}` : ""}. Модел „${model}“ болон API token-оо шалгана уу.`
    );
  }

  if (payload?.status === "failed" || payload?.status === "canceled") {
    throw new Error(
      `Replicate загвар ажиллаж чадсангүй (${payload.status})${payload.error ? `: ${String(payload.error)}` : ""}.`
    );
  }

  const text = readOutputText(payload?.output);

  if (!text.trim()) {
    throw new Error("Replicate хоосон хариу буцаалаа. Дахин оролдоно уу.");
  }

  return text;
}

/** Some models stream chunks (string[]), others return one string. */
function readOutputText(output: unknown): string {
  if (typeof output === "string") {
    return output;
  }

  if (Array.isArray(output)) {
    return output.map((chunk) => (typeof chunk === "string" ? chunk : "")).join("");
  }

  return "";
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Pulls the first JSON value out of a reply. Instruction-tuned models very
 * often wrap their JSON in prose or a ``` fence however firmly the prompt
 * asks them not to, so the raw text is never trusted to parse on its own.
 */
export function parseJsonFromModelText(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();

  try {
    return JSON.parse(candidate);
  } catch {
    // fall through to a bracket scan
  }

  const start = candidate.search(/[[{]/);

  if (start === -1) {
    throw new Error("Загвар JSON буцаасангүй.");
  }

  const opener = candidate[start];
  const closer = opener === "[" ? "]" : "}";
  const end = candidate.lastIndexOf(closer);

  if (end <= start) {
    throw new Error("Загвар бүтэн JSON буцаасангүй.");
  }

  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch (error) {
    throw new Error(`Загварын JSON уншигдсангүй: ${getMessage(error)}`);
  }
}
