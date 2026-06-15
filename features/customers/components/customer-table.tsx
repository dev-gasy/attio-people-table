import { useMemo, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Mail, MapPin, Phone, User } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { CustomerFavoriteButton } from "@/features/customers/components/customer-favorite-button";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { Pagination } from "@/components/ui/pagination";
import { SortableTableHeader } from "@/components/ui/sortable-table-header";
import type {
  Customer,
  CustomerContactKind,
} from "@/features/customers/customer-mappers";
import { usePagination } from "@/hooks/use-pagination";
import { useSortCycle } from "@/hooks/use-sort-cycle";

const CUSTOMERS_PAGE_SIZE = 25;
const CUSTOMER_TABLE_COLUMNS =
  "grid-cols-[minmax(220px,1.35fr)_minmax(120px,170px)_minmax(140px,210px)_minmax(160px,260px)_minmax(100px,140px)]";

type CustomerSortKey = "name" | "phone" | "email" | "address" | "dateOfBirth";

export function CustomerTable({
  customers,
  favoriteIdSet,
  isFavorite,
  toggleFavorite,
  shouldLoadCustomers,
  isLoading,
  isError,
  error,
  isRetrying,
  idleMessage,
  emptyMessage,
  onRetry,
}: {
  customers: Customer[];
  favoriteIdSet: Set<number>;
  isFavorite: (customerId: number) => boolean;
  toggleFavorite: (customerId: number) => void;
  shouldLoadCustomers: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isRetrying: boolean;
  idleMessage: string;
  emptyMessage: string;
  onRetry: () => void;
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
    initialPageSize: CUSTOMERS_PAGE_SIZE,
  });

  function handleSort(key: CustomerSortKey) {
    sort.handleSort(key);
    pagination.resetPage();
  }

  return (
    <>
      <div className="overflow-auto rounded-xl border border-border bg-muted/10">
        <div className="w-full min-w-0">
          <div
            className={`sticky top-0 z-10 grid ${CUSTOMER_TABLE_COLUMNS} border-b border-border/60 bg-background`}
          >
            <CustomerTableHeaderCell>
              <SortableTableHeader
                icon={User}
                label="Customer"
                sortKey="name"
                activeSort={sort.sortKey}
                direction={sort.direction}
                onSort={handleSort}
              />
            </CustomerTableHeaderCell>
            <CustomerTableHeaderCell>
              <SortableTableHeader
                icon={Phone}
                label="Phone"
                sortKey="phone"
                activeSort={sort.sortKey}
                direction={sort.direction}
                onSort={handleSort}
              />
            </CustomerTableHeaderCell>
            <CustomerTableHeaderCell>
              <SortableTableHeader
                icon={Mail}
                label="Email"
                sortKey="email"
                activeSort={sort.sortKey}
                direction={sort.direction}
                onSort={handleSort}
              />
            </CustomerTableHeaderCell>
            <CustomerTableHeaderCell>
              <SortableTableHeader
                icon={MapPin}
                label="Address"
                sortKey="address"
                activeSort={sort.sortKey}
                direction={sort.direction}
                onSort={handleSort}
              />
            </CustomerTableHeaderCell>
            <CustomerTableHeaderCell last>
              <SortableTableHeader
                icon={CalendarDays}
                label="DOB"
                sortKey="dateOfBirth"
                activeSort={sort.sortKey}
                direction={sort.direction}
                onSort={handleSort}
              />
            </CustomerTableHeaderCell>
          </div>

          {!shouldLoadCustomers ? (
            <CustomerTableEmptyState message={idleMessage} />
          ) : isLoading ? (
            <CustomerTableLoadingRows />
          ) : isError ? (
            <DataErrorView
              title="Could not load customers"
              message={getErrorMessage(error)}
              onRetry={onRetry}
              isRetrying={isRetrying}
            />
          ) : (
            pagination.pageItems.map((customer) => (
              <div
                key={customer.id}
                className={`group grid ${CUSTOMER_TABLE_COLUMNS} border-b border-border/60 text-left hover:bg-muted/30`}
              >
                <span className="flex min-w-0 max-w-full items-center gap-2.5 border-r border-border/60 px-4 py-2.5">
                  <CustomerFavoriteButton
                    favorite={isFavorite(customer.id)}
                    onClick={() => toggleFavorite(customer.id)}
                  />
                  <Link
                    to="/customers/$customerId"
                    params={{ customerId: String(customer.id) }}
                    className="flex min-w-0 flex-1 items-center gap-2.5"
                  >
                    <Avatar initial={customer.initial} color={customer.color} />
                    <span className="min-w-0 max-w-full truncate text-base font-semibold text-foreground">
                      {customer.name}
                    </span>
                  </Link>
                </span>
                <CustomerDetailCellLink customerId={customer.id}>
                  <PreferredContactValue customer={customer} kind="phone" />
                </CustomerDetailCellLink>
                <CustomerDetailCellLink customerId={customer.id}>
                  <PreferredContactValue customer={customer} kind="email" />
                </CustomerDetailCellLink>
                <CustomerDetailCellLink customerId={customer.id}>
                  <PreferredContactValue customer={customer} kind="address" />
                </CustomerDetailCellLink>
                <CustomerDetailCellLink customerId={customer.id} last>
                  <span className="min-w-0 max-w-full truncate text-sm text-muted-foreground">
                    {customer.dateOfBirth}
                  </span>
                </CustomerDetailCellLink>
              </div>
            ))
          )}

          {shouldLoadCustomers &&
            !isLoading &&
            !isError &&
            customers.length === 0 && (
              <CustomerTableEmptyState message={emptyMessage} />
            )}
        </div>
      </div>

      {shouldLoadCustomers &&
        !isLoading &&
        !isError &&
        orderedCustomers.length > 0 && (
          <Pagination
            page={pagination.currentPage}
            pageCount={pagination.pageCount}
            total={orderedCustomers.length}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
            bordered={false}
            padded={false}
            className="sticky bottom-0 z-20 mt-0 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          />
        )}
    </>
  );
}

function CustomerTableEmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function CustomerDetailCellLink({
  customerId,
  children,
  last,
}: {
  customerId: number;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <Link
      to="/customers/$customerId"
      params={{ customerId: String(customerId) }}
      className={`flex min-w-0 max-w-full items-center px-4 py-2.5 ${
        last ? "" : "border-r border-border/60"
      }`}
    >
      {children}
    </Link>
  );
}

function CustomerTableLoadingRows() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className={`grid ${CUSTOMER_TABLE_COLUMNS} border-b border-border/60`}
        >
          <CustomerLoadingCell widths={["h-8 w-8 rounded-full", "h-3 w-32"]} />
          <CustomerLoadingCell widths={["h-3 w-28"]} />
          <CustomerLoadingCell widths={["h-3 w-44"]} />
          <CustomerLoadingCell widths={["h-3 w-60"]} />
          <CustomerLoadingCell widths={["h-3 w-28"]} last />
        </div>
      ))}
    </>
  );
}

function PreferredContactValue({
  customer,
  kind,
}: {
  customer: Customer;
  kind: CustomerContactKind;
}) {
  const contact = getPreferredContact(customer, kind);

  return (
    <span
      className={`min-w-0 max-w-full truncate text-sm ${
        contact ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {contact?.value ?? "Not set"}
    </span>
  );
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

function getPreferredContact(customer: Customer, kind: CustomerContactKind) {
  return customer.contacts.find((item) => item.kind === kind && item.preferred);
}

const stringCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function CustomerLoadingCell({
  widths,
  last,
}: {
  widths: string[];
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 max-w-full items-center gap-2.5 px-4 py-2.5 ${
        last ? "" : "border-r border-border/60"
      }`}
    >
      {widths.map((width) => (
        <span
          key={width}
          className={`${width} block max-w-full animate-pulse bg-muted`}
        />
      ))}
    </div>
  );
}

function CustomerTableHeaderCell({
  children,
  last,
}: {
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`min-w-0 max-w-full ${last ? "" : "border-r border-border"} px-4 py-3`}
    >
      {children}
    </div>
  );
}
