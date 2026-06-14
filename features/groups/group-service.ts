import { fetchJson } from "@/features/shared/fetch-json";
import type { GroupDto, CreateGroupDto } from "@/features/groups/group-dtos";
import { queryOptions } from "@tanstack/react-query";

export const groupsQueryOptions = () =>
  queryOptions({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
  });

export function getGroups() {
  return fetchJson<GroupDto[]>("/api/groups");
}

export function createGroup(
  input: CreateGroupDto,
  groups: GroupDto[],
): GroupDto {
  const id = Math.max(0, ...groups.map((group) => group.id)) + 1;

  return {
    id,
    name: input.name.trim(),
    domain: input.domain?.trim() || "example.com",
    employees: normalizeEmployees(input.employees),
    arr: input.arr?.trim() || "$0",
    status: input.status,
    location: input.location?.trim() || "Remote",
  };
}

function normalizeEmployees(value: string | number | undefined) {
  const employees = Number(value);
  return Number.isFinite(employees) ? Math.max(0, employees) : 0;
}
