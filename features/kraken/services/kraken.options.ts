import { queryOptions } from "@tanstack/react-query";
import { krakenMapper } from "./kraken.mapper";
import { krakenService } from "./kraken.service";

export const krakenOptions = {
  all: () => ["kraken"] as const,

  entrypoints: () =>
    queryOptions({
      queryKey: [...krakenOptions.all(), "entrypoints"] as const,
      queryFn: () => krakenService.getEntrypoints(),
      select: krakenMapper.toEntrypointsModel,
      staleTime: 1000 * 60 * 5,
    }),

  rules: (entrypointName: string) =>
    queryOptions({
      queryKey: [
        ...krakenOptions.all(),
        "entrypoints",
        entrypointName,
        "rules",
      ] as const,
      queryFn: () => krakenService.getEntrypointRules(entrypointName),
      select: krakenMapper.toRulesResponseModel,
      staleTime: 1000 * 60 * 5,
    }),
};
