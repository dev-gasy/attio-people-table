import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "@/features/shared/fetch-json";
import { lookupSeed, type LookupDto } from "@/features/lookups/lookup-dtos";
import { createSlug } from "@/features/shared/slugs";

export type LookupNameDto = {
  name: string;
  slug: string;
  lookupsCount: number;
};

export type LookupNameResponseDto = {
  lookupName: LookupNameDto;
  lookups: LookupDto[];
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
  return fetchJson<LookupDto[]>("/api/lookups");
}

export function getLookupNames() {
  return fetchJson<LookupNameDto[]>("/api/lookups/names");
}

export function getLookupName(lookupName: string) {
  return fetchJson<LookupNameResponseDto>(`/api/lookups/names/${lookupName}`);
}

export function getStaticLookupNames(): LookupNameDto[] {
  const names = Array.from(
    new Set(lookupSeed.map((lookup) => lookup.lookupName)),
  );

  return names.map((lookupName) => ({
    name: lookupName,
    slug: createSlug(lookupName),
    lookupsCount: lookupSeed.filter(
      (lookup) => lookup.lookupName === lookupName,
    ).length,
  }));
}
