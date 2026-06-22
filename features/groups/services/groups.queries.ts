import { useSuspenseQuery } from "@tanstack/react-query";
import { groupsOptions } from "./groups.options";
import type { GroupFilters } from "./groups.types";

export const useGroupsQuery = (filters: GroupFilters) =>
  useSuspenseQuery(groupsOptions.list(filters));
