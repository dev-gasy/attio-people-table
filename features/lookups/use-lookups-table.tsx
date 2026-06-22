import { useDeferredValue, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Hash, Languages, ListOrdered } from "lucide-react";
import {
  filterLookups,
  type LookupSortKey,
} from "@/features/lookups/domain/lookups";
import type { Lookup } from "@/features/lookups/lookup-mappers";
import { useColumnVisibility } from "@/hooks/use-column-visibility";
import { useTanStackClientTable } from "@/hooks/use-tanstack-client-table";

export type LookupColumnKey = LookupSortKey;

export const lookupNameCodeStyles: Record<string, string> = {
  "Account tier": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Age: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  "Billing cycle": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  "Contact method": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "Customer status": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Language: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  Priority: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Region: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
};

const lookupTableColumns = [
  {
    accessorKey: "code",
    id: "code",
    sortingFn: "alphanumeric",
    cell: ({ row, getValue }) => (
      <code
        className={`min-w-0 truncate rounded-md px-2 py-0.5 text-xs ${
          lookupNameCodeStyles[row.original.lookupName] ??
          "bg-muted text-muted-foreground"
        }`}
      >
        {getValue<string>()}
      </code>
    ),
    meta: {
      alwaysVisible: true,
      icon: Hash,
      label: "Code",
      loadingWidths: ["h-5 w-24 rounded-md"],
      minWidth: 220,
      width: "minmax(220px, 0.85fr)",
    },
  },
  {
    accessorKey: "displayValueEn",
    id: "displayValueEn",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => (
      <span className="min-w-0 truncate text-foreground">
        {getValue<string>()}
      </span>
    ),
    meta: {
      icon: Languages,
      label: "Display value EN",
      loadingWidths: ["h-3 w-40"],
      minWidth: 220,
      width: "minmax(220px, 1fr)",
    },
  },
  {
    accessorKey: "displayValueFr",
    id: "displayValueFr",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => (
      <span className="min-w-0 truncate text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
    meta: {
      icon: Languages,
      label: "Display value FR",
      loadingWidths: ["h-3 w-40"],
      minWidth: 220,
      width: "minmax(220px, 1fr)",
    },
  },
  {
    accessorKey: "effectiveDateValue",
    id: "effectiveDate",
    sortingFn: "alphanumeric",
    cell: ({ row }) => (
      <span className="min-w-0 truncate text-muted-foreground">
        {row.original.effectiveDate}
      </span>
    ),
    meta: {
      icon: CalendarDays,
      label: "Effective date",
      loadingWidths: ["h-3 w-24"],
      minWidth: 160,
      width: "minmax(140px, 180px)",
    },
  },
  {
    accessorKey: "orderNo",
    id: "orderNo",
    cell: ({ getValue }) => (
      <span className="min-w-0 truncate text-muted-foreground">
        {getValue<number>()}
      </span>
    ),
    meta: {
      icon: ListOrdered,
      label: "Order No.",
      loadingWidths: ["h-3 w-12"],
      minWidth: 120,
      width: "minmax(110px, 130px)",
    },
  },
] satisfies ColumnDef<Lookup>[];

export const lookupColumns = lookupTableColumns.map((column) => ({
  id: column.id as LookupColumnKey,
  label: column.meta?.label ?? column.id,
  alwaysVisible: column.meta?.alwaysVisible,
}));

const defaultLookupColumnVisibility: Record<LookupColumnKey, boolean> = {
  orderNo: true,
  code: true,
  displayValueEn: true,
  displayValueFr: true,
  effectiveDate: true,
};

export function useLookupsTable(lookups: Lookup[]) {
  const [query, setQueryState] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = deferredQuery !== query;

  const columnVisibility = useColumnVisibility({
    columns: lookupColumns,
    defaultVisibility: defaultLookupColumnVisibility,
  });

  const filteredLookups = useMemo(() => {
    return filterLookups({ lookups, query: deferredQuery });
  }, [lookups, deferredQuery]);

  const table = useTanStackClientTable({
    data: filteredLookups,
    columns: lookupTableColumns,
    columnVisibility: columnVisibility.columnVisibility,
    getRowId: (row) => String(row.id),
  });

  function setQuery(value: string) {
    setQueryState(value);
  }

  function handleColumnToggle(column: LookupColumnKey) {
    columnVisibility.toggleColumn(column);
    if (table.sort.sortKey === column) {
      table.sort.resetSort();
    }
  }

  return {
    columnVisibility,
    handleColumnToggle,
    isStale,
    pagination: table.pagination,
    query,
    setQuery,
    sort: table.sort,
    sortedRows: table.sortedRows,
    table: table.table,
    tableGridStyle: table.tableGridStyle,
    tableMinWidth: table.tableMinWidth,
    visibleColumns: table.visibleColumns,
  };
}

export type LookupsTableState = ReturnType<typeof useLookupsTable>;
