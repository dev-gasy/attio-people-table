import { queryOptions } from "@tanstack/react-query";
import {
  mapLookupDtosToLookups,
  type Lookup,
} from "@/features/lookups/lookup-mappers";
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
  return getLookupsServer().then(mapLookupDtosToLookups);
}

export function getLookupNames() {
  return getLookupNamesServer();
}

export async function getLookupName(
  lookupName: string,
): Promise<LookupNameResponse> {
  const response = await getLookupNameServer({ data: { lookupName } });

  return {
    ...response,
    lookups: mapLookupDtosToLookups(response.lookups),
  };
}

export function getStaticLookupNames(): LookupNameDto[] {
  return getStaticLookupNamesPayload();
}
