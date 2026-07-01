import { queryOptions } from "@tanstack/react-query";
import { groupMapper } from "./groups.mapper";
import { groupsService } from "./groups.service";
import type { GroupFilters } from "./groups.types";

export const groupsQueryOptions = {
  all: () => ["groups"] as const,

  list: (filters: GroupFilters) =>
    queryOptions({
      queryKey: [...groupsQueryOptions.all(), filters] as const,
      queryFn: () => groupsService.getAll(filters),
      select: groupMapper.toModels,
      staleTime: 1000 * 60 * 5,
    }),
};
