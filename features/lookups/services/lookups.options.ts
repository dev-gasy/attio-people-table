import { queryOptions } from "@tanstack/react-query";
import { lookupMapper } from "./lookups.mapper";
import { lookupsService } from "./lookups.service";

export const lookupsOptions = {
  all: () => ["lookups"] as const,

  list: () =>
    queryOptions({
      queryKey: lookupsOptions.all(),
      queryFn: () => lookupsService.getAll(),
      select: lookupMapper.toModels,
      staleTime: 1000 * 60 * 5,
    }),

  names: () =>
    queryOptions({
      queryKey: [...lookupsOptions.all(), "names"] as const,
      queryFn: () => lookupsService.getNames(),
      staleTime: 1000 * 60 * 5,
    }),

  detail: (lookupName: string) =>
    queryOptions({
      queryKey: [...lookupsOptions.all(), "names", lookupName] as const,
      queryFn: () => lookupsService.getByName(lookupName),
      select: lookupMapper.toDetailModel,
      staleTime: 1000 * 60 * 5,
    }),
};
