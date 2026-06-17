import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Mail, MapPin, Phone, User } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { CustomerFavoriteButton } from "@/features/customers/components/shared/customer-favorite-button";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import {
  SortableTableHeader,
  TableHeaderCell,
  TableLoadingRows,
} from "@/components/ui/table";
import type {
  Customer,
  CustomerContactKind,
} from "@/features/customers/data/customer-mappers";
import {
  getPreferredContact,
  type CustomerTableState,
} from "@/features/customers/hooks/use-customer-table";

const CUSTOMER_TABLE_COLUMNS =
  "grid-cols-[minmax(220px,1.35fr)_minmax(120px,170px)_minmax(140px,210px)_minmax(160px,260px)_minmax(100px,140px)]";

const CUSTOMER_LOADING_COLUMNS = [
  { widths: ["h-8 w-8 rounded-full", "h-3 w-32"] },
  { widths: ["h-3 w-28"] },
  { widths: ["h-3 w-44"] },
  { widths: ["h-3 w-60"] },
  { widths: ["h-3 w-28"] },
];

export function CustomerTable({
  customers,
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
  table,
}: {
  customers: Customer[];
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
  table: CustomerTableState;
}) {
  return (
    <div className="min-h-0">
      <div className="overflow-auto rounded-xl border border-border bg-muted/10">
        <div className="w-full min-w-0">
          <div
            className={`sticky top-0 z-10 grid ${CUSTOMER_TABLE_COLUMNS} border-b border-border/60 bg-background`}
          >
            <TableHeaderCell>
              <SortableTableHeader
                icon={User}
                label="Customer"
                sortKey="name"
                activeSort={table.sort.sortKey}
                direction={table.sort.direction}
                onSort={table.handleSort}
              />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortableTableHeader
                icon={Phone}
                label="Phone"
                sortKey="phone"
                activeSort={table.sort.sortKey}
                direction={table.sort.direction}
                onSort={table.handleSort}
              />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortableTableHeader
                icon={Mail}
                label="Email"
                sortKey="email"
                activeSort={table.sort.sortKey}
                direction={table.sort.direction}
                onSort={table.handleSort}
              />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortableTableHeader
                icon={MapPin}
                label="Address"
                sortKey="address"
                activeSort={table.sort.sortKey}
                direction={table.sort.direction}
                onSort={table.handleSort}
              />
            </TableHeaderCell>
            <TableHeaderCell last>
              <SortableTableHeader
                icon={CalendarDays}
                label="DOB"
                sortKey="dateOfBirth"
                activeSort={table.sort.sortKey}
                direction={table.sort.direction}
                onSort={table.handleSort}
              />
            </TableHeaderCell>
          </div>

          {!shouldLoadCustomers ? (
            <CustomerTableEmptyState message={idleMessage} />
          ) : isLoading ? (
            <TableLoadingRows
              columns={CUSTOMER_LOADING_COLUMNS}
              gridClassName={CUSTOMER_TABLE_COLUMNS}
              rowCount={table.pagination.pageSize}
            />
          ) : isError ? (
            <DataErrorView
              title="Could not load customers"
              message={getErrorMessage(error)}
              onRetry={onRetry}
              isRetrying={isRetrying}
            />
          ) : (
            table.pagination.pageItems.map((customer) => (
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
    </div>
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
