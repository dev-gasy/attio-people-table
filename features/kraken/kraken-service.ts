import { queryOptions } from "@tanstack/react-query";
import type {
  KrakenEntrypointDto,
  KrakenEntrypointRulesResponseDto,
} from "@/features/kraken/kraken-dtos";
import {
  getKrakenEntrypointRulesServer,
  getKrakenEntrypointsServer,
  getStaticKrakenEntrypointsPayload,
} from "@/features/kraken/kraken-server";

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
  return getKrakenEntrypointsServer();
}

export function getKrakenEntrypointRules(entrypointName: string) {
  return getKrakenEntrypointRulesServer({ data: { entrypointName } });
}

export function getStaticKrakenEntrypoints(): KrakenEntrypointDto[] {
  return getStaticKrakenEntrypointsPayload();
}
