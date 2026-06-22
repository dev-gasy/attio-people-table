import type {
  Customer,
  CustomerContactDto,
  CustomerDto,
  CustomerProductDto,
  CustomerResponseDto,
  CustomersResponseDto,
} from "./customers.types";

const customerColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-sky-500",
];

const customerColorById: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-emerald-500",
  3: "bg-amber-500",
  4: "bg-rose-500",
};

function getInitial(dto: CustomerDto) {
  const initials = `${dto.firstName[0] ?? ""}${dto.lastName[0] ?? ""}`;

  if (initials.length > 0) return initials.toUpperCase();

  return dto.name.replace(/\s+/g, "").slice(0, 2).toUpperCase() || "?";
}

export const customerMapper = {
  toModel(
    dto: CustomerDto,
    contacts: CustomerContactDto[],
    products: CustomerProductDto[],
  ): Customer {
    return {
      ...dto,
      initial: getInitial(dto),
      color:
        customerColorById[dto.id] ??
        customerColors[dto.id % customerColors.length],
      contacts: contacts.filter((contact) => contact.customerId === dto.id),
      products: products.filter((product) => product.customerId === dto.id),
    };
  },

  toModels(response: CustomersResponseDto): Customer[] {
    return response.customers.map((customer) =>
      customerMapper.toModel(customer, response.contacts, response.products),
    );
  },

  toDetailModel(response: CustomerResponseDto): Customer | undefined {
    return response.customer
      ? customerMapper.toModel(
          response.customer,
          response.contacts,
          response.products,
        )
      : undefined;
  },
};
