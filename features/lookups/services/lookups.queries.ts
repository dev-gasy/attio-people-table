import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { lookupsOptions } from "./lookups.options";

export const useLookupNamesQuery = () => useQuery(lookupsOptions.names());

export const useLookupNameQuery = (lookupName: string) =>
  useSuspenseQuery(lookupsOptions.detail(lookupName));
