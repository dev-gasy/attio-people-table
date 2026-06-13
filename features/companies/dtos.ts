import { faker } from "@faker-js/faker";

export type CompanyStatusDto = "Customer" | "Prospect" | "Churned" | "Lead";

export type CompanyDto = {
  id: number;
  name: string;
  domain: string;
  employees: number;
  arr: string;
  status: CompanyStatusDto;
  location: string;
};

export type CreateCompanyDto = {
  name: string;
  domain?: string;
  employees?: string;
  arr?: string;
  status: CompanyStatusDto;
  location?: string;
};

const companyStatusSeeds = [
  "Customer",
  "Prospect",
  "Churned",
  "Lead",
] satisfies CompanyStatusDto[];

faker.seed(2001);

export const companiesSeed: CompanyDto[] = Array.from({ length: 300 }, (_, index) => {
  const name = faker.company.name();
  const arr = faker.number.float({ min: 0.1, max: 25, fractionDigits: 1 });

  return {
    id: index + 1,
    name,
    domain: faker.internet.domainName(),
    employees: faker.number.int({ min: 8, max: 12000 }),
    arr: `$${arr.toFixed(1)}M`,
    status: faker.helpers.arrayElement(companyStatusSeeds),
    location: faker.helpers.arrayElement([
      faker.location.city(),
      `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
      "Remote",
    ]),
  };
});
