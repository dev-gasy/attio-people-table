import { queryOptions } from "@tanstack/react-query";
import type {
  KrakenEntrypointDto,
  KrakenEntrypointRulesResponseDto,
} from "@/features/kraken/kraken-dtos";
import { getStaticKrakenEntrypointsPayload } from "@/features/kraken/kraken-server";
import { fetchJson } from "@/features/shared/fetch-json";

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
    `/api/kraken/entrypoints/${encodeURIComponent(entrypointName)}/rules`,
  );
}

export function getStaticKrakenEntrypoints(): KrakenEntrypointDto[] {
  return getStaticKrakenEntrypointsPayload();
}
