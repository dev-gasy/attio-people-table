import { queryOptions } from "@tanstack/react-query";
import type {
  KrakenEntrypointDto,
  KrakenEntrypointRulesResponseDto,
} from "@/features/kraken/kraken-dtos";
import { fetchJson } from "@/features/shared/fetch-json";
import { createSlug } from "@/features/shared/slugs";
import { entrypoints, rules } from "@/lib/workspace-data";

export const krakenEntrypointsQueryOptions = () =>
  queryOptions({
    queryKey: ["kraken", "entrypoints"],
    queryFn: () => getKrakenEntrypoints(),
  });

export const krakenEntrypointRulesQueryOptions = (entrypointName: string) =>
  queryOptions({
    queryKey: ["kraken", "entrypoints", entrypointName, "rules"],
    queryFn: () => getKrakenEntrypointRules(entrypointName),
  });

export function getKrakenEntrypoints() {
  return fetchJson<KrakenEntrypointDto[]>("/api/kraken/entrypoints");
}

export function getKrakenEntrypointRules(entrypointName: string) {
  return fetchJson<KrakenEntrypointRulesResponseDto>(
    `/api/kraken/entrypoints/${entrypointName}/rules`,
  );
}

export function getStaticKrakenEntrypoints(): KrakenEntrypointDto[] {
  return entrypoints.map((entrypoint) => ({
    ...entrypoint,
    slug: createSlug(entrypoint.name),
    rulesCount: rules.filter((rule) => rule.entrypointId === entrypoint.id)
      .length,
  }));
}
