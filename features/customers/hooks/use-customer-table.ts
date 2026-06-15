import { useMemo } from "react";
import type {
  Customer,
  CustomerContactKind,
} from "@/features/customers/data/customer-mappers";
import {
  type CustomerSortKey,
  type CustomerTableScope,
  useCustomerTableStore,
} from "@/features/customers/stores/customer-table-store";

export type CustomerTableState = ReturnType<typeof useCustomerTable>;

export function useCustomerTable({
  customers,
  scope,
}: {
  customers: Customer[];
  scope: CustomerTableScope;
}) {
  const tableSettings = useCustomerTableStore((state) => state.tables[scope]);
  const resetPage = useCustomerTableStore((state) => state.resetPage);
  const resetSort = useCustomerTableStore((state) => state.resetSort);
  const setPage = useCustomerTableStore((state) => state.setPage);
  const setPageSize = useCustomerTableStore((state) => state.setPageSize);
  const sortBy = useCustomerTableStore((state) => state.sortBy);
  const orderedCustomers = useMemo(
    () =>
      tableSettings.sortKey
        ? sortCustomers(
            customers,
            tableSettings.sortKey,
            tableSettings.direction,
          )
        : customers,
    [customers, tableSettings.direction, tableSettings.sortKey],
  );
  const total = orderedCustomers.length;
  const pageCount = Math.max(1, Math.ceil(total / tableSettings.pageSize));
  const currentPage = Math.min(tableSettings.page, pageCount);
  const pageItems = useMemo(
    () =>
      orderedCustomers.slice(
        (currentPage - 1) * tableSettings.pageSize,
        currentPage * tableSettings.pageSize,
      ),
    [currentPage, orderedCustomers, tableSettings.pageSize],
  );
  const handleSort = (key: CustomerSortKey) => sortBy(scope, key);

  return {
    handleSort,
    orderedCustomers,
    pagination: {
      currentPage,
      page: tableSettings.page,
      pageCount,
      pageItems,
      pageSize: tableSettings.pageSize,
      resetPage: () => resetPage(scope),
      setPage: (page: number) => setPage(scope, page),
      setPageSize: (pageSize: number) => setPageSize(scope, pageSize),
      total,
    },
    sort: {
      direction: tableSettings.direction,
      handleSort,
      resetSort: () => resetSort(scope),
      sortKey: tableSettings.sortKey,
    },
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
