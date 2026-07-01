import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { krakenQueryOptions } from "./kraken.query-options";

export const useKrakenEntrypointsQuery = () =>
  useQuery(krakenQueryOptions.entrypoints());

export const useKrakenEntrypointRulesQuery = (
  entrypointName: string,
  enabled = true,
) => useQuery({ ...krakenQueryOptions.rules(entrypointName), enabled });

export const useSuspenseKrakenEntrypointRulesQuery = (entrypointName: string) =>
  useSuspenseQuery(krakenQueryOptions.rules(entrypointName));
