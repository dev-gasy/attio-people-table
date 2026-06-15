import { useMemo } from "react";
import type {
  Customer,
  CustomerContactKind,
} from "@/features/customers/customer-mappers";
import { usePagination } from "@/hooks/use-pagination";
import { useSortCycle } from "@/hooks/use-sort-cycle";

type CustomerSortKey = "name" | "phone" | "email" | "address" | "dateOfBirth";

export type CustomerTableState = ReturnType<typeof useCustomerTable>;

export function useCustomerTable({
  customers,
  favoriteIdSet,
}: {
  customers: Customer[];
  favoriteIdSet: Set<number>;
}) {
  const sort = useSortCycle<CustomerSortKey>();
  const orderedCustomers = useMemo(
    () =>
      sortCustomersWithFavoritesFirst(
        customers,
        favoriteIdSet,
        sort.sortKey,
        sort.direction,
      ),
    [customers, favoriteIdSet, sort.direction, sort.sortKey],
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

function sortCustomersWithFavoritesFirst(
  customers: Customer[],
  favoriteIdSet: Set<number>,
  sortKey: CustomerSortKey | null,
  direction: "asc" | "desc",
) {
  if (!sortKey) {
    return [
      ...customers.filter((customer) => favoriteIdSet.has(customer.id)),
      ...customers.filter((customer) => !favoriteIdSet.has(customer.id)),
    ];
  }

  const favorites = customers.filter((customer) =>
    favoriteIdSet.has(customer.id),
  );
  const others = customers.filter(
    (customer) => !favoriteIdSet.has(customer.id),
  );

  return [
    ...sortCustomers(favorites, sortKey, direction),
    ...sortCustomers(others, sortKey, direction),
  ];
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
