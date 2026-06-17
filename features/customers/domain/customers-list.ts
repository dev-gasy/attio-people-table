import { z } from "zod";
import type { Customer } from "@/features/customers/data/customer-mappers";

export type CustomerSearchValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  policyQuoteNumber: string;
  email: string;
  phone: string;
  address: string;
};

export const emptyCustomerSearchValues: CustomerSearchValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  policyQuoteNumber: "",
  email: "",
  phone: "",
  address: "",
};

export const CustomerSearchSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string(),
    policyQuoteNumber: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
  })
  .transform(trimCustomerSearchValues)
  .refine(hasCustomerSearchValue, "Unable to search if fields are empty.");

export function trimCustomerSearchValues(
  values: CustomerSearchValues,
): CustomerSearchValues {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    dateOfBirth: values.dateOfBirth.trim(),
    policyQuoteNumber: values.policyQuoteNumber.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
  };
}

export function hasCustomerSearchValue(values: CustomerSearchValues) {
  return Object.values(trimCustomerSearchValues(values)).some(Boolean);
}

export function filterCustomers(
  customers: Customer[],
  values: CustomerSearchValues,
) {
  const normalizedValues = normalizeSearchValues(values);
  const hasSearch = Object.values(normalizedValues).some(Boolean);

  if (!hasSearch) return customers;

  return customers.filter(
    (customer) =>
      searchMatches(normalizedValues.firstName, customer.firstName) ||
      searchMatches(normalizedValues.lastName, customer.lastName) ||
      dateOfBirthMatches(normalizedValues.dateOfBirth, customer.dateOfBirth) ||
      policyQuoteMatches(normalizedValues.policyQuoteNumber, customer) ||
      contactMatches(normalizedValues.email, customer, "email") ||
      contactMatches(normalizedValues.phone, customer, "phone") ||
      contactMatches(normalizedValues.address, customer, "address"),
  );
}

export function sortFavoriteCustomersFirst(
  customers: Customer[],
  favoriteIdSet: Set<number>,
) {
  if (favoriteIdSet.size === 0) return customers;

  return [
    ...customers.filter((customer) => favoriteIdSet.has(customer.id)),
    ...customers.filter((customer) => !favoriteIdSet.has(customer.id)),
  ];
}

function normalizeSearchValues(values: CustomerSearchValues) {
  return {
    firstName: normalize(values.firstName),
    lastName: normalize(values.lastName),
    dateOfBirth: values.dateOfBirth.trim(),
    policyQuoteNumber: normalize(values.policyQuoteNumber),
    email: normalize(values.email),
    phone: normalize(values.phone),
    address: normalize(values.address),
  };
}

function searchMatches(searchValue: string, value: string) {
  return searchValue.length > 0 && normalize(value).includes(searchValue);
}

function dateOfBirthMatches(searchValue: string, value: string) {
  return searchValue.length > 0 && value === searchValue;
}

function contactMatches(
  searchValue: string,
  customer: Customer,
  kind: "email" | "phone" | "address",
) {
  return (
    searchValue.length > 0 &&
    customer.contacts.some(
      (contact) =>
        contact.kind === kind && normalize(contact.value).includes(searchValue),
    )
  );
}

function policyQuoteMatches(searchValue: string, customer: Customer) {
  return (
    searchValue.length > 0 &&
    customer.products.some(
      (product) =>
        (product.type === "Policy" || product.type === "Quote") &&
        normalize(product.referenceNumber).includes(searchValue),
    )
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
