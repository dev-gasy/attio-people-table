import type { Group, GroupDto } from "./groups.types";

const groupColors = [
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

const provinceLabels: Record<GroupDto["province"], string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NT: "Northwest Territories",
  NS: "Nova Scotia",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

export const groupMapper = {
  toModel(dto: GroupDto): Group {
    return {
      ...dto,
      initial: dto.organization[0]?.toUpperCase() ?? "?",
      color: groupColorById[dto.id] ?? groupColors[dto.id % groupColors.length],
      provinceLabel: provinceLabels[dto.province],
    };
  },

  toModels(dtos: GroupDto[]): Group[] {
    return dtos.map(groupMapper.toModel);
  },
};
