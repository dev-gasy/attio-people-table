import { faker } from "@faker-js/faker";

export type CustomerStatusDto = "Active" | "Prospect" | "At risk" | "Inactive";

export type CustomerContactKindDto = "phone" | "email" | "address";

export type CustomerProductTypeDto = "Policy" | "Quote" | "Claim" | "Renewal";
export type CustomerProductActivityDto = "Active" | "Inactive";
export type CustomerProductBusinessDimensionDto =
  | "Personal lines"
  | "Commercial"
  | "Life and health"
  | "Claims"
  | "Pipeline";

export type CustomerDto = {
  id: number;
  name: string;
  status: CustomerStatusDto;
  segment: string;
  owner: string;
  location: string;
  since: string;
  summary: string;
  lifetimeValue: string;
  risk: "Low" | "Medium" | "High";
};

export type CustomerContactDto = {
  id: number;
  customerId: number;
  kind: CustomerContactKindDto;
  label: string;
  value: string;
  preferred: boolean;
};

export type CustomerProductDto = {
  id: number;
  customerId: number;
  type: CustomerProductTypeDto;
  businessDimension: CustomerProductBusinessDimensionDto;
  activity: CustomerProductActivityDto;
  name: string;
  status: string;
  amount: string;
  effectiveDate: string;
};

const customerStatusSeeds = [
  "Active",
  "Prospect",
  "At risk",
  "Inactive",
] satisfies CustomerStatusDto[];

const customerRiskSeeds = ["Low", "Medium", "High"] satisfies CustomerDto["risk"][];

const customerSegmentSeeds = [
  "Private client",
  "High net worth",
  "Small business owner",
  "Family plan",
  "Commercial account",
  "Life and health",
];

const customerOwnerSeeds = [
  "Julian Herbst",
  "Nicole Gold",
  "Lena Cremers",
  "Ana Gantt",
  "Leon Heinrichs",
  "Tom Holland",
];

const customerContactKinds = [
  "phone",
  "email",
  "address",
] satisfies CustomerContactKindDto[];

const customerProductTypes = [
  "Policy",
  "Quote",
  "Claim",
  "Renewal",
] satisfies CustomerProductTypeDto[];

const customerProductDimensions = [
  "Personal lines",
  "Commercial",
  "Life and health",
  "Claims",
  "Pipeline",
] satisfies CustomerProductBusinessDimensionDto[];

const customerProductActivities = [
  "Active",
  "Inactive",
] satisfies CustomerProductActivityDto[];

const productStatusSeeds = [
  "In force",
  "Underwriting",
  "Draft",
  "Sent",
  "Scheduled",
  "Needs review",
  "Open",
  "Closed",
  "Cancelled",
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

faker.seed(3001);

export const customersSeed: CustomerDto[] = Array.from({ length: 300 }, (_, index) => {
  const sinceDate = faker.date.between({
    from: new Date("2018-01-01"),
    to: new Date("2026-06-13"),
  });

  return {
    id: index + 1,
    name: faker.person.fullName(),
    status: faker.helpers.arrayElement(customerStatusSeeds),
    segment: faker.helpers.arrayElement(customerSegmentSeeds),
    owner: faker.helpers.arrayElement(customerOwnerSeeds),
    location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
    since: `${sinceDate.toLocaleString("en-US", { month: "short" })} ${sinceDate.getFullYear()}`,
    summary: faker.company.catchPhrase(),
    lifetimeValue: `$${faker.number.float({ min: 2, max: 95, fractionDigits: 1 }).toFixed(1)}K`,
    risk: faker.helpers.arrayElement(customerRiskSeeds),
  };
});

export const customerContactsSeed: CustomerContactDto[] = customersSeed.flatMap(
  (customer) =>
    customerContactKinds.map((kind, index) => ({
      id: (customer.id - 1) * customerContactKinds.length + index + 1,
      customerId: customer.id,
      kind,
      label:
        kind === "phone"
          ? faker.helpers.arrayElement(["Mobile", "Work", "Business"])
          : kind === "email"
            ? faker.helpers.arrayElement(["Personal", "Work", "Documents"])
            : faker.helpers.arrayElement(["Home", "Office", "Mailing"]),
      value:
        kind === "phone"
          ? faker.phone.number({ style: "national" })
          : kind === "email"
            ? faker.internet.email({ firstName: customer.name.split(" ")[0], lastName: customer.name.split(" ").at(-1) }).toLowerCase()
            : `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state({ abbreviated: true })} ${faker.location.zipCode()}`,
      preferred: index === 0,
    })),
);

export const customerProductsSeed: CustomerProductDto[] = customersSeed.flatMap(
  (customer) =>
    Array.from({ length: 5 }, (_, index) => {
      const type = faker.helpers.arrayElement(customerProductTypes);
      const businessDimension =
        type === "Claim"
          ? "Claims"
          : type === "Quote"
            ? "Pipeline"
            : faker.helpers.arrayElement(customerProductDimensions);
      const effectiveDate = faker.date.between({
        from: new Date("2024-01-01"),
        to: new Date("2027-12-31"),
      });

      return {
        id: (customer.id - 1) * 5 + index + 1,
        customerId: customer.id,
        type,
        businessDimension,
        activity: faker.helpers.arrayElement(customerProductActivities),
        name: `${faker.commerce.productAdjective()} ${faker.helpers.arrayElement([
          "Homeowners",
          "Auto",
          "Umbrella",
          "Business Liability",
          "Cyber Liability",
          "Term Life",
          "Commercial Auto",
          "Property",
        ])}`,
        status: faker.helpers.arrayElement(productStatusSeeds),
        amount:
          type === "Claim"
            ? `$${faker.number.int({ min: 500, max: 50000 }).toLocaleString()} reserve`
            : `$${faker.number.int({ min: 240, max: 18000 }).toLocaleString()} / year`,
        effectiveDate: dateFormatter.format(effectiveDate),
      };
    }),
);
