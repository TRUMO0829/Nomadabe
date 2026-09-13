import { getErrorMessage } from "@/lib/server/supabase-rest";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function settledValue<T>(result: PromiseSettledResult<T>, fallback: T) {
  return result.status === "fulfilled" ? result.value : fallback;
}

/** Human-readable messages for the loads that failed, for LoadErrorNotice. */
export function settledErrors(results: Array<PromiseSettledResult<unknown>>) {
  return results
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) => getErrorMessage(result.reason));
}
