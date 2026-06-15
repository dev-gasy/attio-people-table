import { useMemo } from "react";
import type {
  Customer,
  CustomerContactKind,
} from "@/features/customers/customer-mappers";
import { usePagination } from "@/hooks/use-pagination";
import { useSortCycle } from "@/hooks/use-sort-cycle";

type CustomerSortKey = "name" | "phone" | "email" | "address" | "dateOfBirth";

export type CustomerTableState = ReturnType<typeof useCustomerTable>;

export function useCustomerTable({ customers }: { customers: Customer[] }) {
  const sort = useSortCycle<CustomerSortKey>();
  const orderedCustomers = useMemo(
    () =>
      sort.sortKey
        ? sortCustomers(customers, sort.sortKey, sort.direction)
        : customers,
    [customers, sort.direction, sort.sortKey],
  );
  const pagination = usePagination({
    items: orderedCustomers,
  });

  function handleSort(key: CustomerSortKey) {
    sort.handleSort(key);
    pagination.resetPage();
  }

  return {
    handleSort,
    orderedCustomers,
    pagination,
    sort,
  };
}

function sortCustomers(
  customers: Customer[],
  sortKey: CustomerSortKey,
  direction: "asc" | "desc",
) {
  return [...customers].sort((a, b) => {
    const result =
      sortKey === "dateOfBirth"
        ? Date.parse(a.dateOfBirth) - Date.parse(b.dateOfBirth)
        : stringCollator.compare(
            getCustomerSortValue(a, sortKey),
            getCustomerSortValue(b, sortKey),
          );

    return direction === "asc" ? result : -result;
  });
}

function getCustomerSortValue(customer: Customer, sortKey: CustomerSortKey) {
  if (sortKey === "name") return customer.name;
  if (sortKey === "dateOfBirth") return customer.dateOfBirth;

  return getPreferredContact(customer, sortKey)?.value ?? "";
}

export function getPreferredContact(
  customer: Customer,
  kind: CustomerContactKind,
) {
  return customer.contacts.find((item) => item.kind === kind && item.preferred);
}

const stringCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});
