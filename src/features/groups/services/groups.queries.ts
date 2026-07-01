import { useSuspenseQuery } from "@tanstack/react-query";
import { groupsQueryOptions } from "./groups.query-options";
import type { GroupFilters } from "./groups.types";

export const useGroupsQuery = (filters: GroupFilters) =>
  useSuspenseQuery(groupsQueryOptions.list(filters));
