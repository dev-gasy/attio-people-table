import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/components/customers/customers-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import {
  emptyCustomerSearchValues,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/customer-domain/customers-list";

export const Route = createFileRoute("/_app/customers")({
  validateSearch: (search): Partial<CustomerSearchValues> =>
    parseCustomerSearchParams(search),
  errorComponent: (props) => (
    <RouteErrorFallback title="Customers" {...props} />
  ),
  component: CustomersRoute,
});

function CustomersRoute() {
  const search = Route.useSearch();

  return <CustomersPage initialSearchValues={toCustomerSearchValues(search)} />;
}

function parseCustomerSearchParams(
  search: Record<string, unknown>,
): Partial<CustomerSearchValues> {
  const values = trimCustomerSearchValues({
    firstName: getSearchString(search.firstName),
    lastName: getSearchString(search.lastName),
    dateOfBirth: getSearchString(search.dateOfBirth),
    policyQuoteNumber: getSearchString(search.policyQuoteNumber),
    email: getSearchString(search.email),
    phone: getSearchString(search.phone),
    address: getSearchString(search.address),
  });

  return compactCustomerSearchValues(values);
}

function toCustomerSearchValues(
  search: Partial<CustomerSearchValues>,
): CustomerSearchValues {
  return {
    ...emptyCustomerSearchValues,
    ...search,
  };
}

function getSearchString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function compactCustomerSearchValues(values: CustomerSearchValues) {
  const search: Partial<CustomerSearchValues> = {};

  for (const key of Object.keys(values) as Array<keyof CustomerSearchValues>) {
    if (values[key]) {
      search[key] = values[key];
    }
  }

  return search;
}
