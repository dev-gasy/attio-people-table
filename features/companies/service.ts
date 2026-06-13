import {
  companiesSeed,
  type CompanyDto,
  type CreateCompanyDto,
} from "@/features/companies/dtos";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export const companiesQueryOptions = () =>
  queryOptions({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
  });

export const getCompanies = createServerFn({ method: "GET" }).handler(
  async () => companiesSeed,
);

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
