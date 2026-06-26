import { NextResponse } from "next/server";
import type { Adventure, TravelCategory } from "@/lib/adventures";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "INTERNAL_ERROR";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: Record<string, string>
) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export async function rateLimitRequest(
  request: Request,
  scope: string,
  { limit, windowMs }: RateLimitOptions
) {
  const clientIp = getClientIp(request);
  const key = `${scope}:${clientIp}`;

  // Prefer a shared Upstash Redis counter so limits hold across serverless
  // instances. Fall back to the per-instance in-memory counter when Upstash
  // is not configured or unreachable.
  const distributed = await upstashRateLimit(key, limit, windowMs);

  if (distributed === "ok") {
    return null;
  }

  if (distributed === "limited") {
    return rateLimitedResponse(Math.ceil(windowMs / 1000));
  }

  return inMemoryRateLimit(key, limit, windowMs);
}

function inMemoryRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    cleanupRateLimitBuckets(now);
    return null;
  }

  bucket.count += 1;

  if (bucket.count <= limit) {
    return null;
  }

  return rateLimitedResponse(Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)));
}

function rateLimitedResponse(retryAfterSeconds: number) {
  return apiError(
    "RATE_LIMITED",
    "Хэт олон удаа оролдлоо. Түр хүлээгээд дахин оролдоно уу.",
    429,
    { retryAfter: String(retryAfterSeconds) }
  );
}

async function upstashRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<"ok" | "limited" | "unavailable"> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return "unavailable";
  }

  const redisKey = `ratelimit:${key}`;
  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));

  try {
    // Atomic INCR, then set the TTL only on the first hit of the window.
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, String(windowSeconds), "NX"],
      ]),
    });

    if (!response.ok) {
      return "unavailable";
    }

    const result = (await response.json()) as Array<{ result?: number; error?: string }>;
    const count = result?.[0]?.result;

    if (typeof count !== "number") {
      return "unavailable";
    }

    return count <= limit ? "ok" : "limited";
  } catch {
    return "unavailable";
  }
}

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "local"
  );
}

function cleanupRateLimitBuckets(now: number) {
  if (rateLimitBuckets.size < 500) {
    return;
  }

  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }
}

export function getTripsFromSearchParams(params: URLSearchParams, sourceTrips: Adventure[]) {
  const category = params.get("category");
  const query = params.get("q")?.trim().toLowerCase();
  const featured = params.get("featured");
  let trips = [...sourceTrips];

  if (category) {
    trips = trips.filter((trip) => trip.category === category);
  }

  if (featured === "true") {
    trips = trips.filter((trip) => trip.featured);
  }

  if (query) {
    trips = trips.filter((trip) => matchesTripQuery(trip, query));
  }

  return trips;
}

export function getTripSummary(trips: Adventure[]) {
  // Keep the four known category keys (default 0) for backward compatibility,
  // then layer on counts for any custom categories admins may have added.
  const categories: Record<string, number> = {
    business: 0,
    festival: 0,
    leisure: 0,
    custom: 0,
  };

  for (const trip of trips) {
    categories[trip.category] = (categories[trip.category] ?? 0) + 1;
  }

  return {
    total: trips.length,
    featured: trips.filter((trip) => trip.featured).length,
    categories,
  };
}

export function isTravelCategory(value: string): value is TravelCategory {
  return ["business", "festival", "leisure", "custom"].includes(value);
}

export function sanitizeTrip(trip: Adventure) {
  return {
    ...trip,
    priceLabel:
      trip.price > 0
        ? `${trip.price.toLocaleString()} ${trip.currency}`
        : "Үнийн санал авах",
  };
}

function matchesTripQuery(trip: Adventure, query: string) {
  const haystack = [
    trip.title,
    trip.summary,
    trip.location,
    trip.country,
    trip.category,
    trip.nextDeparture ?? "",
    trip.groupSize,
    ...trip.tags,
    ...trip.idealFor,
    ...trip.includes,
    ...trip.businessSupport,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}
