import { NextResponse } from "next/server";
import { ADVENTURES, type Adventure, type TravelCategory } from "@/lib/adventures";

export type ApiErrorCode =
  | "BAD_REQUEST"
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

export function getTripsFromSearchParams(params: URLSearchParams) {
  const category = params.get("category");
  const query = params.get("q")?.trim().toLowerCase();
  const featured = params.get("featured");

  let trips = [...ADVENTURES];

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

function matchesTripQuery(trip: Adventure, query: string) {
  const haystack = [
    trip.title,
    trip.summary,
    trip.location,
    trip.country,
    trip.category,
    ...trip.tags,
    ...trip.idealFor,
    ...trip.businessSupport,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function isTravelCategory(value: string): value is TravelCategory {
  return ["business", "expo", "leisure", "custom"].includes(value);
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
