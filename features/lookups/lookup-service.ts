import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "@/features/shared/fetch-json";
import type { LookupDto } from "@/features/lookups/lookup-dtos";

export const lookupsQueryOptions = () =>
  queryOptions({
    queryKey: ["lookups"],
    queryFn: () => getLookups(),
  });

export function getLookups() {
  return fetchJson<LookupDto[]>("/api/lookups");
}
