import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { krakenOptions } from "./kraken.options";

export const useKrakenEntrypointsQuery = () =>
  useQuery(krakenOptions.entrypoints());

export const useKrakenEntrypointRulesQuery = (
  entrypointName: string,
  enabled = true,
) => useQuery({ ...krakenOptions.rules(entrypointName), enabled });

export const useSuspenseKrakenEntrypointRulesQuery = (entrypointName: string) =>
  useSuspenseQuery(krakenOptions.rules(entrypointName));
