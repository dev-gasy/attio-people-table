import { queryOptions } from "@tanstack/react-query";
import type { LookupDto } from "@/features/lookups/lookup-dtos";
import {
  getLookupNameServer,
  getLookupNamesServer,
  getLookupsServer,
  getStaticLookupNamesPayload,
} from "@/features/lookups/lookup-server";

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
  return getLookupsServer();
}

export function getLookupNames() {
  return getLookupNamesServer();
}

export function getLookupName(lookupName: string) {
  return getLookupNameServer({ data: { lookupName } });
}

export function getStaticLookupNames(): LookupNameDto[] {
  return getStaticLookupNamesPayload();
}
