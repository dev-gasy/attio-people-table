import { createServerFn } from "@tanstack/react-start";
import { groupsSeed, type GroupDto } from "@/features/groups/group-dtos";

export type GroupFilters = {
  province?: string;
  search?: string;
};

export const getGroupsServer = createServerFn({ method: "GET" })
  .validator((data: GroupFilters | undefined) => data ?? {})
  .handler(async ({ data }) => {
    return filterGroups(groupsSeed, data);
  });

export function filterGroups(groups: GroupDto[], filters: GroupFilters) {
  const province = filters.province?.trim().toUpperCase();
  const search = filters.search?.trim().toLowerCase();

  return groups.filter((group) => {
    if (province && group.province !== province) {
      return false;
    }

    if (search && search.length >= 3 && !matchesGroupSearch(group, search)) {
      return false;
    }

    return true;
  });
}

function matchesGroupSearch(group: GroupDto, search: string) {
  return [
    group.organization,
    group.groupShortNameFr,
    group.groupShortNameEn,
    group.onlineIdentifier,
  ].some((value) => value.toLowerCase().includes(search));
}
