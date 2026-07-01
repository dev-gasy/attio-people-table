import { useQueries, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { krakenQueryOptions } from "./kraken.query-options";
import type { KrakenEntrypoint } from "./kraken.types";

export const useKrakenEntrypointsQuery = () =>
  useQuery(krakenQueryOptions.entrypoints());

export const useKrakenEntrypointRulesQuery = (
  entrypointName: string,
  enabled = true,
) => useQuery({ ...krakenQueryOptions.rules(entrypointName), enabled });

export const useSuspenseKrakenEntrypointRulesQuery = (entrypointName: string) =>
  useSuspenseQuery(krakenQueryOptions.rules(entrypointName));

export const useKrakenEntrypointRulesQueries = (
  entrypoints: KrakenEntrypoint[],
) =>
  useQueries({
    queries: entrypoints.map((entrypoint) =>
      krakenQueryOptions.rules(entrypoint.name),
    ),
  });
