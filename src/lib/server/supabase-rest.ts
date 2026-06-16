const SUPABASE_REST_SUFFIX = "/rest/v1";

export function getSupabaseUrl() {
  const rawUrl = firstEnvValue("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");

  if (!rawUrl) {
    return "";
  }

  return rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

export function getSupabaseRestUrl() {
  const baseUrl = getSupabaseUrl();
  return baseUrl ? `${baseUrl}${SUPABASE_REST_SUFFIX}` : "";
}

export function getSupabaseAnonKey() {
  return firstEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY");
}

export function getSupabaseServiceKey() {
  return firstEnvValue("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_KEY");
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey() && getSupabaseServiceKey());
}

export function getMissingSupabaseEnvNames() {
  const missing: string[] = [];

  if (!getSupabaseUrl()) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!getSupabaseAnonKey()) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (!getSupabaseServiceKey()) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  return missing;
}

export async function supabaseRest<T>(
  path: string,
  init: RequestInit & { prefer?: string } = {}
) {
  const restUrl = getSupabaseRestUrl();
  const serviceKey = getSupabaseServiceKey();

  if (!restUrl || !serviceKey) {
    throw new Error(getSupabaseConfigurationErrorMessage());
  }

  const response = await fetch(`${restUrl}${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await getSupabaseError(response));
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export function getSupabaseConfigurationErrorMessage() {
  const missing = getMissingSupabaseEnvNames();

  if (missing.length === 0) {
    return "Supabase is not configured correctly.";
  }

  return `Supabase is missing required environment variables: ${missing.join(", ")}. Add them in Vercel Project Settings > Environment Variables, then redeploy.`;
}

export function isMissingSupabaseTableError(error: unknown) {
  const message = getErrorMessage(error);

  return (
    /\b42P01\b/i.test(message) ||
    /relation .+ does not exist/i.test(message) ||
    /could not find the table/i.test(message) ||
    /schema cache/i.test(message)
  );
}

export function getMissingSupabaseSchemaMessage() {
  return "Supabase admin/storage хүснэгтүүд дутуу байна. Supabase SQL Editor дээр supabase/schema.sql файлын хамгийн сүүлийн хувилбарыг ажиллуулаад Vercel-ээ redeploy хийнэ үү.";
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error ?? "");
}

function firstEnvValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

export async function getSupabaseError(response: Response) {
  const text = await response.text().catch(() => "");

  if (!text) {
    return `Supabase request failed with status ${response.status}.`;
  }

  try {
    const error = JSON.parse(text) as { message?: string; error_description?: string };
    return error.message ?? error.error_description ?? text;
  } catch {
    return text;
  }
}
