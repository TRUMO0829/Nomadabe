import { NextResponse } from "next/server";
import type { Adventure, TravelCategory } from "@/lib/adventures";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
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
  return {
    total: trips.length,
    featured: trips.filter((trip) => trip.featured).length,
    categories: {
      business: trips.filter((trip) => trip.category === "business").length,
      expo: trips.filter((trip) => trip.category === "expo").length,
      leisure: trips.filter((trip) => trip.category === "leisure").length,
      custom: trips.filter((trip) => trip.category === "custom").length,
    },
  };
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
