import { fetchJson } from "@/features/shared/fetch-json";
import type {
  CompanyDto,
  CreateCompanyDto,
} from "@/features/companies/company-dtos";
import { queryOptions } from "@tanstack/react-query";

export const companiesQueryOptions = () =>
  queryOptions({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
  });

export function getCompanies() {
  return fetchJson<CompanyDto[]>("/api/companies");
}

export function createCompany(
  input: CreateCompanyDto,
  companies: CompanyDto[],
): CompanyDto {
  const id = Math.max(0, ...companies.map((company) => company.id)) + 1;

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
