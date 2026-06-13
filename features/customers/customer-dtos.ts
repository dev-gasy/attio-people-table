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
  firstName: string;
  lastName: string;
  name: string;
  dateOfBirth: string;
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
  referenceNumber: string;
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

const customerRiskSeeds = [
  "Low",
  "Medium",
  "High",
] satisfies CustomerDto["risk"][];

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

const productReferencePrefixes: Record<CustomerProductTypeDto, string> = {
  Policy: "POL",
  Quote: "QUO",
  Claim: "CLM",
  Renewal: "REN",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

faker.seed(3001);

export const customersSeed: CustomerDto[] = Array.from(
  { length: 300 },
  (_, index) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const dateOfBirth = faker.date.birthdate({
      min: 18,
      max: 85,
      mode: "age",
    });
    const sinceDate = faker.date.between({
      from: new Date("2018-01-01"),
      to: new Date("2026-06-13"),
    });

    return {
      id: index + 1,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      dateOfBirth: dateOfBirth.toISOString().slice(0, 10),
      status: faker.helpers.arrayElement(customerStatusSeeds),
      segment: faker.helpers.arrayElement(customerSegmentSeeds),
      owner: faker.helpers.arrayElement(customerOwnerSeeds),
      location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
      since: `${sinceDate.toLocaleString("en-US", { month: "short" })} ${sinceDate.getFullYear()}`,
      summary: faker.company.catchPhrase(),
      lifetimeValue: `$${faker.number.float({ min: 2, max: 95, fractionDigits: 1 }).toFixed(1)}K`,
      risk: faker.helpers.arrayElement(customerRiskSeeds),
    };
  },
);

const customerContactTemplates: Array<{
  kind: CustomerContactKindDto;
  labels: string[];
}> = [
  { kind: "phone", labels: ["Mobile", "Work"] },
  { kind: "email", labels: ["Personal", "Work"] },
  { kind: "address", labels: ["Home", "Mailing"] },
];

const contactsPerCustomer = customerContactTemplates.reduce(
  (total, template) => total + template.labels.length,
  0,
);

export const customerContactsSeed: CustomerContactDto[] = customersSeed.flatMap(
  (customer) =>
    customerContactTemplates.flatMap(({ kind, labels }, kindIndex) =>
      labels.map((label, contactIndex) => ({
        id: (customer.id - 1) * contactsPerCustomer +
          kindIndex * labels.length +
          contactIndex +
          1,
        customerId: customer.id,
        kind,
        label,
        value: createCustomerContactValue(customer, kind, contactIndex),
        preferred: contactIndex === 0,
      })),
    ),
);

function createCustomerContactValue(
  customer: CustomerDto,
  kind: CustomerContactKindDto,
  contactIndex: number,
) {
  if (kind === "phone") {
    return faker.phone.number({ style: "national" });
  }

  if (kind === "email") {
    const suffix = contactIndex === 0 ? undefined : String(contactIndex + 1);

    return faker.internet
      .email({
        firstName: suffix
          ? `${customer.firstName}${suffix}`
          : customer.firstName,
        lastName: customer.lastName,
      })
      .toLowerCase();
  }

  return `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state({ abbreviated: true })} ${faker.location.zipCode()}`;
}

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
        referenceNumber: `${productReferencePrefixes[type]}-${String(
          (customer.id - 1) * 5 + index + 1,
        ).padStart(6, "0")}`,
        businessDimension,
        activity: faker.helpers.arrayElement(customerProductActivities),
        name: `${faker.commerce.productAdjective()} ${faker.helpers.arrayElement(
          [
            "Homeowners",
            "Auto",
            "Umbrella",
            "Business Liability",
            "Cyber Liability",
            "Term Life",
            "Commercial Auto",
            "Property",
          ],
        )}`,
        status: faker.helpers.arrayElement(productStatusSeeds),
        amount:
          type === "Claim"
            ? `$${faker.number.int({ min: 500, max: 50000 }).toLocaleString()} reserve`
            : `$${faker.number.int({ min: 240, max: 18000 }).toLocaleString()} / year`,
        effectiveDate: dateFormatter.format(effectiveDate),
      };
    }),
);
