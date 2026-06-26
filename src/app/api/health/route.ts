import { ok } from "@/lib/server/api";
import { getAdminStore } from "@/lib/server/admin-store";
import {
  getMissingSupabaseEnvNames,
  isSupabaseConfigured,
} from "@/lib/server/supabase-rest";

export const runtime = "nodejs";

export async function GET() {
  const store = await getAdminStore();
  const missingSupabaseEnv = getMissingSupabaseEnvNames();
  const integrations = {
    supabase: {
      configured: isSupabaseConfigured(),
      missingEnv: missingSupabaseEnv,
    },
    mail: {
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      fromConfigured: Boolean(process.env.MAIL_FROM),
    },
    n8n: {
      chatConfigured: Boolean(process.env.N8N_CHAT_WEBHOOK_URL),
    },
    translation: {
      libreTranslateConfigured: Boolean(process.env.LIBRETRANSLATE_URL),
    },
    rateLimiting: {
      upstashConfigured: Boolean(
        process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ),
    },
  };

  return ok({
    status: missingSupabaseEnv.length === 0 ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    integrations,
    storage: {
      trips: store.trips.length,
      services: store.services.length,
      siteSettings: Boolean(store.siteSettings),
    },
  });
}
