import { type ReactNode, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Mail, MapPin, Phone, User } from "lucide-react";
import { Avatar } from "@/shared/components/avatar";
import { CustomerFavoriteButton } from "@/features/customers/components/shared/customer-favorite-button";
import type {
  Customer,
  CustomerContactKind,
} from "@/features/customers/services/customers.types";
import { useTanStackClientTable } from "@/shared/hooks/use-tanstack-client-table";

export type CustomerTableState = ReturnType<typeof useCustomerTable>;

export function useCustomerTable({
  customers,
  isFavorite,
  toggleFavorite,
}: {
  customers: Customer[];
  isFavorite: (customerId: number) => boolean;
  toggleFavorite: (customerId: number) => void;
}) {
  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        cell: ({ row }) => {
          const customer = row.original;

          return (
            <span className="flex min-w-0 flex-1 items-center gap-2.5">
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
          );
        },
        meta: {
          icon: User,
          label: "Customer",
          loadingWidths: ["h-8 w-8 rounded-full", "h-3 w-32"],
          width: "minmax(220px,1.35fr)",
        },
      },
      {
        accessorFn: (customer) =>
          getPreferredContact(customer, "phone")?.value ?? "",
        id: "phone",
        sortingFn: "alphanumeric",
        cell: ({ row }) =>
          createCustomerDetailLink(
            row.original,
            createPreferredContactValue(row.original, "phone"),
          ),
        meta: {
          icon: Phone,
          label: "Phone",
          loadingWidths: ["h-3 w-28"],
          width: "minmax(120px,170px)",
        },
      },
      {
        accessorFn: (customer) =>
          getPreferredContact(customer, "email")?.value ?? "",
        id: "email",
        sortingFn: "alphanumeric",
        cell: ({ row }) =>
          createCustomerDetailLink(
            row.original,
            createPreferredContactValue(row.original, "email"),
          ),
        meta: {
          icon: Mail,
          label: "Email",
          loadingWidths: ["h-3 w-44"],
          width: "minmax(140px,210px)",
        },
      },
      {
        accessorFn: (customer) =>
          getPreferredContact(customer, "address")?.value ?? "",
        id: "address",
        sortingFn: "alphanumeric",
        cell: ({ row }) =>
          createCustomerDetailLink(
            row.original,
            createPreferredContactValue(row.original, "address"),
          ),
        meta: {
          icon: MapPin,
          label: "Address",
          loadingWidths: ["h-3 w-60"],
          width: "minmax(160px,260px)",
        },
      },
      {
        accessorFn: (customer) => Date.parse(customer.dateOfBirth),
        id: "dateOfBirth",
        cell: ({ row }) =>
          createCustomerDetailLink(
            row.original,
            <span className="min-w-0 max-w-full truncate text-sm text-muted-foreground">
              {row.original.dateOfBirth}
            </span>,
          ),
        meta: {
          icon: CalendarDays,
          label: "DOB",
          loadingWidths: ["h-3 w-28"],
          width: "minmax(100px,140px)",
        },
      },
    ],
    [isFavorite, toggleFavorite],
  );
  const table = useTanStackClientTable({
    data: customers,
    columns,
    getRowId: (row) => String(row.id),
  });

  return {
    pagination: table.pagination,
    sortedRows: table.sortedRows,
    sort: table.sort,
    table: table.table,
    tableGridStyle: table.tableGridStyle,
    tableMinWidth: table.tableMinWidth,
    visibleColumns: table.visibleColumns,
  };
}

export function getPreferredContact(
  customer: Customer,
  kind: CustomerContactKind,
) {
  return customer.contacts.find((item) => item.kind === kind && item.preferred);
}

function createCustomerDetailLink(customer: Customer, children: ReactNode) {
  return (
    <Link
      to="/customers/$customerId"
      params={{ customerId: String(customer.id) }}
      className="flex min-w-0 max-w-full items-center"
    >
      {children}
    </Link>
  );
}

function createPreferredContactValue(
  customer: Customer,
  kind: CustomerContactKind,
) {
  const contact = getPreferredContact(customer, kind);

  return (
    <span
      className="min-w-0 max-w-full truncate text-sm text-muted-foreground"
      title={contact?.value ?? "Not provided"}
    >
      {contact?.value ?? "Not provided"}
    </span>
  );
}
