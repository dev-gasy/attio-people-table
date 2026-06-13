import type { CompanyStatus } from "@/features/companies/company-mappers";
import {
  companyColors,
  statusList,
  statusOptions,
} from "@/features/companies/company-mappers";

export const COMPANIES_PAGE_SIZE = 8;
export { companyColors, statusList, statusOptions };

export const emptyCompanyForm = {
  name: "",
  domain: "",
  status: "Prospect" as CompanyStatus,
  employees: "",
  arr: "",
  location: "",
};

export type CompanyForm = typeof emptyCompanyForm;
