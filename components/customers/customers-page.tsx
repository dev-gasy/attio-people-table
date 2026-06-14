"use client";

import {
  useEffect,
  useRef,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Download,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/avatar";
import { CustomerFavoriteButton } from "@/components/customers/customer-favorite-button";
import { CustomerSearchForm } from "@/components/customers/customer-search-form";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/ui/pagination";
import { SortableTableHeader } from "@/components/ui/sortable-table-header";
import {
  filterCustomers,
  emptyCustomerSearchValues,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/customer-domain/customers-list";
import {
  formatCustomerFavoriteIdsJson,
  parseCustomerFavoriteIdsJson,
} from "@/features/customers/customer-domain/favorites";
import { customersQueryOptions } from "@/features/customers/customer-service";
import { useCustomerFavorites } from "@/features/customers/use-customer-favorites";
import {
  type Customer,
  type CustomerContactKind,
  mapCustomerDtosToCustomers,
} from "@/features/customers/customer-mappers";

const CUSTOMERS_PAGE_SIZE = 25;
const CUSTOMER_TABLE_COLUMNS =
  "grid-cols-[minmax(220px,1.35fr)_minmax(120px,170px)_minmax(140px,210px)_minmax(160px,260px)_minmax(100px,140px)]";
type CustomerSortKey = "name" | "phone" | "email" | "address" | "dateOfBirth";

export function CustomersPage({
  initialSearchValues = emptyCustomerSearchValues,
}: {
  initialSearchValues?: CustomerSearchValues;
}) {
  const navigate = useNavigate();
  const { data, isPending } = useQuery(customersQueryOptions());
  const {
    favoriteIds,
    favoriteIdSet,
    isFavorite,
    setFavoriteIds,
    toggleFavorite,
  } = useCustomerFavorites();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [favoritesImportError, setFavoritesImportError] = useState<
    string | null
  >(null);
  const [searchValues, setSearchValues] = useState<CustomerSearchValues>(
    initialSearchValues,
  );
  const [sortKey, setSortKey] = useState<CustomerSortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(CUSTOMERS_PAGE_SIZE);
  const customers = useMemo(
    () =>
      data
        ? mapCustomerDtosToCustomers(
            data.customers,
            data.contacts,
            data.products,
          )
        : [],
    [data],
  );
  const filteredCustomers = useMemo(
    () => filterCustomers(customers, searchValues),
    [customers, searchValues],
  );
  const orderedCustomers = useMemo(
    () =>
      sortCustomersWithFavoritesFirst(
        filteredCustomers,
        favoriteIdSet,
        sortKey,
        sortDirection,
      ),
    [favoriteIdSet, filteredCustomers, sortDirection, sortKey],
  );
  const pageCount = Math.max(1, Math.ceil(orderedCustomers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageCustomers = useMemo(
    () =>
      orderedCustomers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [currentPage, orderedCustomers, pageSize],
  );

  useEffect(() => {
    setSearchValues(initialSearchValues);
    setPage(1);
  }, [initialSearchValues]);

  function handleSaveFavorites() {
    const blob = new Blob([formatCustomerFavoriteIdsJson(favoriteIds)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "favorite-customers.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleSort(key: CustomerSortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortKey(null);
      setSortDirection("asc");
    }
    setPage(1);
  }

  async function handleLoadFavorites(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      const result = parseCustomerFavoriteIdsJson(await file.text());

      if (!result.ok) {
        setFavoritesImportError(result.error);
        return;
      }

      setFavoriteIds(result.ids);
      setFavoritesImportError(null);
      setPage(1);
    } catch {
      setFavoritesImportError("Could not read favorites JSON.");
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Customers"
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {favoritesImportError && (
              <span className="text-sm text-destructive">
                {favoritesImportError}
              </span>
            )}
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleLoadFavorites}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Upload className="h-4 w-4" />
              Load favorites
            </button>
            <button
              type="button"
              onClick={handleSaveFavorites}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Save favorites
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto px-6 pb-8">
        <CustomerSearchForm
          values={searchValues}
          disabled={isPending}
          onSearch={(values) => {
            const trimmedValues = trimCustomerSearchValues(values);

            setSearchValues(trimmedValues);
            setPage(1);
            navigate({
              to: "/customers",
              search: compactCustomerSearchValues(trimmedValues),
            });
          }}
          onReset={() => {
            setSearchValues(emptyCustomerSearchValues);
            setPage(1);
            navigate({ to: "/customers", search: {} });
          }}
        />

        <div className="mt-4 overflow-auto rounded-xl border border-border bg-muted/10">
          <div className="w-full min-w-0">
            <div
              className={`sticky top-0 z-10 grid ${CUSTOMER_TABLE_COLUMNS} border-b border-border/60 bg-background`}
            >
              <CustomerTableHeaderCell>
                <SortableTableHeader
                  icon={User}
                  label="Customer"
                  sortKey="name"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </CustomerTableHeaderCell>
              <CustomerTableHeaderCell>
                <SortableTableHeader
                  icon={Phone}
                  label="Phone"
                  sortKey="phone"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </CustomerTableHeaderCell>
              <CustomerTableHeaderCell>
                <SortableTableHeader
                  icon={Mail}
                  label="Email"
                  sortKey="email"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </CustomerTableHeaderCell>
              <CustomerTableHeaderCell>
                <SortableTableHeader
                  icon={MapPin}
                  label="Address"
                  sortKey="address"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </CustomerTableHeaderCell>
              <CustomerTableHeaderCell last>
                <SortableTableHeader
                  icon={CalendarDays}
                  label="DOB"
                  sortKey="dateOfBirth"
                  activeSort={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </CustomerTableHeaderCell>
            </div>

            {isPending ? (
              <CustomerTableLoadingRows />
            ) : (
              pageCustomers.map((customer) => (
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
                      <Avatar
                        initial={customer.initial}
                        color={customer.color}
                      />
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

            {!isPending && filteredCustomers.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No customers match your search
              </div>
            )}
          </div>
        </div>
      </div>

      {!isPending && orderedCustomers.length > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={orderedCustomers.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}
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

function compactCustomerSearchValues(values: CustomerSearchValues) {
  const trimmedValues = trimCustomerSearchValues(values);
  const search: Partial<CustomerSearchValues> = {};

  for (const key of Object.keys(trimmedValues) as Array<
    keyof CustomerSearchValues
  >) {
    if (trimmedValues[key]) {
      search[key] = trimmedValues[key];
    }
  }

  return search;
}

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
