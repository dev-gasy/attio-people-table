export type ProvinceCode =
  | "AB"
  | "BC"
  | "MB"
  | "NB"
  | "NL"
  | "NT"
  | "NS"
  | "NU"
  | "ON"
  | "PE"
  | "QC"
  | "SK"
  | "YT";

export type GroupDto = {
  id: number;
  organization: string;
  groupShortNameFr: string;
  groupShortNameEn: string;
  onlineIdentifier: string;
  province: ProvinceCode;
};

export type Group = GroupDto & {
  initial: string;
  color: string;
  provinceLabel: string;
};

export type GroupFilters = {
  province?: string;
  search?: string;
};
