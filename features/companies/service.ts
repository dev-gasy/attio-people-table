import {
  companiesSeed,
  type CompanyDto,
  type CreateCompanyDto,
} from "@/features/companies/dtos";

export function getCompanies(): CompanyDto[] {
  return companiesSeed;
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
    employees: Number(input.employees) || 0,
    arr: input.arr?.trim() || "$0",
    status: input.status,
    location: input.location?.trim() || "Remote",
  };
}
