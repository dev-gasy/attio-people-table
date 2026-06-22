import { queryOptions } from "@tanstack/react-query";
import {
  mapLookupDtosToLookups,
  type Lookup,
} from "@/features/lookups/lookup-mappers";
import { getStaticLookupNamesPayload } from "@/features/lookups/lookup-server";
import type { LookupDto } from "@/features/lookups/lookup-dtos";
import { fetchJson } from "@/features/shared/fetch-json";

export type LookupNameDto = {
  name: string;
  slug: string;
  lookupsCount: number;
};

export type LookupNameResponse = {
  lookupName: LookupNameDto;
  lookups: Lookup[];
};

export const lookupsQueryOptions = () =>
  queryOptions({
    queryKey: ["lookups"],
    queryFn: () => getLookups(),
  });

export const lookupNamesQueryOptions = () =>
  queryOptions({
    queryKey: ["lookups", "names"],
    queryFn: () => getLookupNames(),
  });

export const lookupNameQueryOptions = (lookupName: string) =>
  queryOptions({
    queryKey: ["lookups", "names", lookupName],
    queryFn: () => getLookupName(lookupName),
  });

export function getLookups() {
  return fetchJson<LookupDto[]>("/api/lookups").then(mapLookupDtosToLookups);
}

export function getLookupNames() {
  return fetchJson<LookupNameDto[]>("/api/lookups/names");
}

export async function getLookupName(
  lookupName: string,
): Promise<LookupNameResponse> {
  const response = await fetchJson<{
    lookupName: LookupNameDto;
    lookups: LookupDto[];
  }>(`/api/lookups/names/${encodeURIComponent(lookupName)}`);

  return {
    ...response,
    lookups: mapLookupDtosToLookups(response.lookups),
  };
}

export function getStaticLookupNames(): LookupNameDto[] {
  return getStaticLookupNamesPayload();
}
