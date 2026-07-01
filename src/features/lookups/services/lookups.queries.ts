import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { lookupsQueryOptions } from "./lookups.query-options";

export const useLookupNamesQuery = () => useQuery(lookupsQueryOptions.names());

export const useLookupNameQuery = (lookupName: string) =>
  useSuspenseQuery(lookupsQueryOptions.detail(lookupName));
