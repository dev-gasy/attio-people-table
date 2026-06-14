import type { GroupDto, GroupStatusDto } from "@/features/groups/group-dtos";

export type GroupStatus = GroupStatusDto;

export type Group = {
  id: number;
  name: string;
  initial: string;
  color: string;
  domain: string;
  employees: number;
  arr: string;
  status: GroupStatus;
  location: string;
};

export const statusList: GroupStatus[] = [
  "Customer",
  "Prospect",
  "Lead",
  "Churned",
];

export const statusOptions = statusList.map((status) => ({
  value: status,
  label: status,
}));

export const groupColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-blue-500",
];

export const groupStatusStyles: Record<
  GroupStatus,
  { dot: string; text: string }
> = {
  Customer: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  Prospect: { dot: "bg-sky-500", text: "text-sky-700 dark:text-sky-300" },
  Lead: { dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-300" },
  Churned: { dot: "bg-rose-500", text: "text-rose-700 dark:text-rose-300" },
};

const groupColorById: Record<number, string> = {
  1: "bg-indigo-500",
  2: "bg-zinc-700",
  3: "bg-zinc-500",
  4: "bg-rose-500",
  5: "bg-violet-500",
  6: "bg-amber-500",
  7: "bg-purple-500",
  8: "bg-blue-500",
  9: "bg-sky-500",
  10: "bg-emerald-500",
  11: "bg-emerald-600",
  12: "bg-rose-600",
};

export function mapGroupDtoToGroup(dto: GroupDto): Group {
  return {
    ...dto,
    initial: dto.name[0]?.toUpperCase() ?? "?",
    color: groupColorById[dto.id] ?? groupColors[dto.id % groupColors.length],
  };
}

export function mapGroupDtosToGroups(dtos: GroupDto[]): Group[] {
  return dtos.map(mapGroupDtoToGroup);
}
