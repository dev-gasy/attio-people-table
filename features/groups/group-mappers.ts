import {
  provinceOptions,
  type GroupDto,
  type ProvinceCode,
} from "@/features/groups/group-dtos";

export type Group = {
  id: number;
  organization: string;
  initial: string;
  color: string;
  groupShortNameFr: string;
  groupShortNameEn: string;
  onlineIdentifier: string;
  province: ProvinceCode;
  provinceLabel: string;
};

export const groupColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-blue-500",
];

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

const provinceLabelByCode = new Map(
  provinceOptions.map((province) => [province.value, province.label]),
);

export function mapGroupDtoToGroup(dto: GroupDto): Group {
  return {
    ...dto,
    initial: dto.organization[0]?.toUpperCase() ?? "?",
    color: groupColorById[dto.id] ?? groupColors[dto.id % groupColors.length],
    provinceLabel: provinceLabelByCode.get(dto.province) ?? dto.province,
  };
}

export function mapGroupDtosToGroups(dtos: GroupDto[]): Group[] {
  return dtos.map(mapGroupDtoToGroup);
}
