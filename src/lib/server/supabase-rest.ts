const SUPABASE_REST_SUFFIX = "/rest/v1";

export function getSupabaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

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
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

export function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}

export async function supabaseRest<T>(
  path: string,
  init: RequestInit & { prefer?: string } = {}
) {
  const restUrl = getSupabaseRestUrl();
  const serviceKey = getSupabaseServiceKey();

  if (!restUrl || !serviceKey) {
    throw new Error("Supabase URL or service role key is not configured.");
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
