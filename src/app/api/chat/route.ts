import { readFile } from "node:fs/promises";
import path from "node:path";
import { apiError, ok, sanitizeTrip } from "@/lib/server/api";
import { getServices, getTrips } from "@/lib/server/admin-store";

export const runtime = "nodejs";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1600;
const KNOWLEDGE_FILE = path.join(process.cwd(), "Nomadabe_Travel_Knowledge_Base.md");

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return apiError(
      "INTERNAL_ERROR",
      "DeepSeek API key тохируулаагүй байна. DEEPSEEK_API_KEY утгыг .env.local файлд нэмнэ үү.",
      503
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return apiError("BAD_REQUEST", "JSON body буруу байна.", 400);
  }

  const messages = parseMessages(payload);
  if (!messages) {
    return apiError(
      "BAD_REQUEST",
      "messages талбар user/assistant role болон content-той массив байх ёстой.",
      400
    );
  }

  try {
    const [knowledge, trips, services] = await Promise.all([
      getKnowledgeContext(),
      getTrips(),
      getServices(),
    ]);

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
        messages: [
          {
            role: "system",
            content: buildSystemPrompt({
              knowledge,
              trips: trips.map(sanitizeTrip),
              services,
            }),
          },
          ...messages,
        ],
        stream: false,
        temperature: 0.4,
        max_tokens: 900,
        thinking: { type: "disabled" },
      }),
    });

    const result = (await response.json().catch(() => ({}))) as DeepSeekResponse;

    if (!response.ok) {
      return apiError(
        "INTERNAL_ERROR",
        result.error?.message || "DeepSeek API дуудлага амжилтгүй боллоо.",
        response.status
      );
    }

    const reply = result.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return apiError("INTERNAL_ERROR", "DeepSeek хоосон хариу буцаалаа.", 502);
    }

    return ok({ reply });
  } catch (error) {
    return apiError(
      "INTERNAL_ERROR",
      error instanceof Error ? error.message : "Чатботын сервер дээр алдаа гарлаа.",
      500
    );
  }
}

function parseMessages(payload: unknown) {
  if (!isRecord(payload) || !Array.isArray(payload.messages)) {
    return null;
  }

  const messages: ChatMessage[] = [];

  for (const item of payload.messages.slice(-MAX_MESSAGES)) {
    if (!isRecord(item)) {
      return null;
    }

    const role = item.role;
    const content = typeof item.content === "string" ? item.content.trim() : "";

    if ((role !== "user" && role !== "assistant") || !content) {
      return null;
    }

    messages.push({
      role,
      content: content.slice(0, MAX_MESSAGE_LENGTH),
    });
  }

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return null;
  }

  return messages;
}

async function getKnowledgeContext() {
  try {
    const markdown = await readFile(KNOWLEDGE_FILE, "utf8");
    return markdown.replace(/\s+/g, " ").slice(0, 9000);
  } catch {
    return "";
  }
}

function buildSystemPrompt({
  knowledge,
  trips,
  services,
}: {
  knowledge: string;
  trips: ReturnType<typeof sanitizeTrip>[];
  services: Awaited<ReturnType<typeof getServices>>;
}) {
  const tripLines = trips
    .slice(0, 24)
    .map(
      (trip) =>
        `- ${trip.title}: ${trip.location}, ${trip.country}; ${trip.days} өдөр; ${trip.priceLabel}; ${trip.summary}; тохиромжтой: ${trip.idealFor.join(", ")}; багтсан: ${trip.includes.join(", ")}`
    )
    .join("\n");

  const serviceLines = services
    .map(
      (service) =>
        `- ${service.title}: ${service.description}; онцлох: ${service.highlights.join(", ")}`
    )
    .join("\n");

  return `Чи Nomadabe Travel-ийн AI туслах чатбот.

Үүрэг:
- Монгол хэлээр эелдэг, тодорхой, богино хариул.
- Nomadabe Travel-ийн аялал, чиглэл, бизнес аялал, expo аялал, амралтын аялал, хувийн төлөвлөгөө, маршрут, бэлтгэл, төсөвлөлтийн зөвлөгөөнд тусал.
- Хэрэглэгчийн хугацаа, хүмүүсийн тоо, төсөв, сонирхол, зорих газар тодорхойгүй бол 2-4 богино асуултаар тодруул.
- Үнэ, суудал, нислэг, буудал, огноог баталгаатай мэт зохиож хэлж болохгүй. price=0 эсвэл үнэ байхгүй бол "үнийн санал авах хэрэгтэй" гэж хэл.
- Эмнэлэг, виз, хууль, даатгал зэрэг өндөр эрсдэлтэй шийдвэрт мэргэжлийн эх сурвалж эсвэл Nomadabe багтай баталгаажуулахыг зөвлө.
- Nomadabe болон аяллаас гадуурх асуултад товч хариулаад аяллын зөвлөгөө рүү чиглүүл.

Nomadabe knowledge base:
${knowledge || "Knowledge base файл олдсонгүй."}

Одоогийн аяллын хөтөлбөрүүд:
${tripLines || "Аяллын жагсаалт одоогоор хоосон байна."}

Үйлчилгээнүүд:
${serviceLines || "Үйлчилгээний жагсаалт одоогоор хоосон байна."}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
