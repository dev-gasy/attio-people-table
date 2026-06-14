import type {
  CustomerContactDto,
  CustomerContactKindDto,
  CustomerDto,
  CustomerProductActivityDto,
  CustomerProductBusinessDimensionDto,
  CustomerProductDto,
  CustomerProductTypeDto,
  CustomerStatusDto,
} from "@/features/customers/customer-dtos";

export type CustomerStatus = CustomerStatusDto;
export type CustomerContactKind = CustomerContactKindDto;
export type CustomerProductActivity = CustomerProductActivityDto;
export type CustomerProductBusinessDimension =
  CustomerProductBusinessDimensionDto;
export type CustomerProductType = CustomerProductTypeDto;

export type CustomerContact = CustomerContactDto;
export type CustomerProduct = CustomerProductDto;

export type Customer = CustomerDto & {
  initial: string;
  color: string;
  contacts: CustomerContact[];
  products: CustomerProduct[];
};

export const customerStatusStyles: Record<
  CustomerStatus,
  { dot: string; text: string }
> = {
  Active: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  Prospect: {
    dot: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-300",
  },
  "At risk": {
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
  },
  Inactive: {
    dot: "bg-zinc-500",
    text: "text-muted-foreground",
  },
};

const customerColorById: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-emerald-500",
  3: "bg-amber-500",
  4: "bg-rose-500",
};

const customerColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-sky-500",
];

export function mapCustomerDtoToCustomer(
  dto: CustomerDto,
  contacts: CustomerContactDto[],
  products: CustomerProductDto[],
): Customer {
  return {
    ...dto,
    initial: getCustomerInitials(dto),
    color:
      customerColorById[dto.id] ??
      customerColors[dto.id % customerColors.length],
    contacts: contacts.filter((contact) => contact.customerId === dto.id),
    products: products.filter((product) => product.customerId === dto.id),
  };
}

export function mapCustomerDtosToCustomers(
  customers: CustomerDto[],
  contacts: CustomerContactDto[],
  products: CustomerProductDto[],
): Customer[] {
  return customers.map((customer) =>
    mapCustomerDtoToCustomer(customer, contacts, products),
  );
}

function getCustomerInitials(customer: CustomerDto) {
  const initials = `${customer.firstName[0] ?? ""}${customer.lastName[0] ?? ""}`;

  if (initials.length > 0) {
    return initials.toUpperCase();
  }

  return customer.name.replace(/\s+/g, "").slice(0, 2).toUpperCase() || "?";
}
