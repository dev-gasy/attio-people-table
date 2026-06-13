import type { Company } from "@/lib/companies-data";

export const COMPANIES_PAGE_SIZE = 8;

export const statusList: Company["status"][] = [
  "Customer",
  "Prospect",
  "Lead",
  "Churned",
];

export const statusOptions = statusList.map((s) => ({ value: s, label: s }));

export const companyColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-blue-500",
];

export const emptyCompanyForm = {
  name: "",
  domain: "",
  status: "Prospect" as Company["status"],
  employees: "",
  arr: "",
  location: "",
};

export type CompanyForm = typeof emptyCompanyForm;

