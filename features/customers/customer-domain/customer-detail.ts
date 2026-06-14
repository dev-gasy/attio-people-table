import type {
  Customer,
  CustomerContact,
  CustomerContactKind,
  CustomerProduct,
  CustomerProductActivity,
  CustomerProductBusinessDimension,
} from "@/features/customers/customer-mappers";

export type CustomerProductActivityFilter = CustomerProductActivity | "All";

export type CustomerProfileField = {
  label: string;
  value: string;
};

export type PreferredCustomerContact = {
  kind: CustomerContactKind;
  label: string;
  value: string;
};

export type CustomerContactGroup = {
  kind: CustomerContactKind;
  title: string;
  contacts: CustomerContact[];
};

export type CustomerProductGroup = {
  dimension: CustomerProductBusinessDimension;
  products: CustomerProduct[];
};

export const customerProductBusinessDimensionOrder: CustomerProductBusinessDimension[] =
  ["Personal lines", "Commercial", "Life and health", "Claims", "Pipeline"];

const customerContactGroupTitles: Record<CustomerContactKind, string> = {
  phone: "Phone list",
  email: "Email list",
  address: "Addresses",
};

const customerContactKindOrder: CustomerContactKind[] = [
  "phone",
  "email",
  "address",
];

export function getCustomerProfileFields(
  customer: Customer,
): CustomerProfileField[] {
  return [
    {
      label: "Customer ID",
      value: `CUS-${String(customer.id).padStart(4, "0")}`,
    },
    { label: "Lifecycle", value: customer.status },
    { label: "Segment", value: customer.segment },
    { label: "Owner", value: customer.owner },
    { label: "Location", value: customer.location },
    { label: "Customer since", value: customer.since },
    { label: "Lifetime value", value: customer.lifetimeValue },
    { label: "Risk", value: customer.risk },
  ];
}

export function getPreferredCustomerContacts(
  customer: Customer,
): PreferredCustomerContact[] {
  return customerContactKindOrder.flatMap((kind) => {
    const contact = customer.contacts.find(
      (item) => item.kind === kind && item.preferred,
    );

    return contact
      ? [{ kind, label: contact.label, value: contact.value }]
      : [];
  });
}

export function getCustomerContactGroups(
  contacts: CustomerContact[],
): CustomerContactGroup[] {
  return customerContactKindOrder.map((kind) => ({
    kind,
    title: customerContactGroupTitles[kind],
    contacts: contacts.filter((contact) => contact.kind === kind),
  }));
}

export function filterCustomerProductsByActivity(
  products: CustomerProduct[],
  activityFilter: CustomerProductActivityFilter,
) {
  return activityFilter === "All"
    ? products
    : products.filter((product) => product.activity === activityFilter);
}

export function groupCustomerProductsByBusinessDimension(
  products: CustomerProduct[],
): CustomerProductGroup[] {
  return customerProductBusinessDimensionOrder
    .map((dimension) => ({
      dimension,
      products: products.filter(
        (product) => product.businessDimension === dimension,
      ),
    }))
    .filter((group) => group.products.length > 0);
}
