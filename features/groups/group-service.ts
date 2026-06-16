import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "@/features/shared/fetch-json";
import type { GroupDto } from "@/features/groups/group-dtos";
import type { GroupFilters } from "@/features/groups/group-server";
import { mapGroupDtosToGroups } from "@/features/groups/group-mappers";

export const groupsQueryOptions = (filters: GroupFilters) =>
  queryOptions({
    queryKey: ["groups", filters],
    queryFn: () => getGroups(filters),
  });

export function getGroups(filters: GroupFilters) {
  return fetchJson<GroupDto[]>(buildGroupsPath(filters)).then(
    mapGroupDtosToGroups,
  );
}

function buildGroupsPath(filters: GroupFilters) {
  const params = new URLSearchParams();
  const province = filters.province?.trim();
  const search = filters.search?.trim();

  if (province) params.set("province", province);
  if (search && search.length >= 3) params.set("search", search);

  const queryString = params.toString();
  return queryString ? `/api/groups?${queryString}` : "/api/groups";
}
