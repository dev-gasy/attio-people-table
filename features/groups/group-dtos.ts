import { faker } from "@faker-js/faker";

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

export const provinceOptions = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
] satisfies Array<{ value: ProvinceCode; label: string }>;

const provinceCodes = provinceOptions.map((province) => province.value);

faker.seed(2001);

export const groupsSeed: GroupDto[] = Array.from(
  { length: 300 },
  (_, index) => {
    const organization =
      index === 0 ? "ABC Assurance Ontario" : faker.company.name();
    const organizationSlug = faker.helpers.slugify(organization).toLowerCase();

    return {
      id: index + 1,
      organization,
      groupShortNameFr:
        index === 0
          ? "ABC ON FR"
          : `${faker.company.buzzNoun().slice(0, 14)} FR`,
      groupShortNameEn:
        index === 0
          ? "ABC ON EN"
          : `${faker.company.buzzNoun().slice(0, 14)} EN`,
      onlineIdentifier:
        index === 0 ? "abc-on" : `${organizationSlug}-${index + 1}`,
      province: index === 0 ? "ON" : faker.helpers.arrayElement(provinceCodes),
    };
  },
);
