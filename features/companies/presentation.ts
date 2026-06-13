import type { CompanyDto, CompanyStatusDto } from "@/features/companies/dtos";

export type CompanyStatus = CompanyStatusDto;

export type Company = {
  id: number;
  name: string;
  initial: string;
  color: string;
  domain: string;
  employees: number;
  arr: string;
  status: CompanyStatus;
  location: string;
};

export const statusList: CompanyStatus[] = [
  "Customer",
  "Prospect",
  "Lead",
  "Churned",
];

export const statusOptions = statusList.map((status) => ({
  value: status,
  label: status,
}));

export const companyColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-blue-500",
];

export const companyStatusStyles: Record<
  CompanyStatus,
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

const companyColorById: Record<number, string> = {
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

export function toCompanyPresentation(dto: CompanyDto): Company {
  return {
    ...dto,
    initial: dto.name[0]?.toUpperCase() ?? "?",
    color:
      companyColorById[dto.id] ?? companyColors[dto.id % companyColors.length],
  };
}

export function toCompaniesPresentation(dtos: CompanyDto[]): Company[] {
  return dtos.map(toCompanyPresentation);
}
