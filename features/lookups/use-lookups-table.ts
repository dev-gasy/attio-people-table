import { useMemo, useState, type ComponentType } from "react";
import { CalendarDays, Hash, Languages } from "lucide-react";
import type { ColumnVisibilityOption } from "@/components/ui/column-visibility-control";
import {
  filterLookups,
  sortLookups,
  type LookupSortKey,
} from "@/features/lookups/lookup-domain/lookups";
import type { Lookup } from "@/features/lookups/lookup-mappers";
import { useColumnVisibility } from "@/hooks/use-column-visibility";
import { usePagination } from "@/hooks/use-pagination";
import { useSortCycle } from "@/hooks/use-sort-cycle";

export type LookupColumnKey = LookupSortKey;

export type LookupColumnConfig = ColumnVisibilityOption<LookupColumnKey> & {
  icon: ComponentType<{ className?: string }>;
  minWidth: number;
  width: string;
};

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

export const lookupColumns: LookupColumnConfig[] = [
  {
    id: "code",
    label: "Code",
    icon: Hash,
    minWidth: 220,
    width: "minmax(220px, 0.85fr)",
    alwaysVisible: true,
  },
  {
    id: "displayValueEn",
    label: "Display value EN",
    icon: Languages,
    minWidth: 220,
    width: "minmax(220px, 1fr)",
  },
  {
    id: "displayValueFr",
    label: "Display value FR",
    icon: Languages,
    minWidth: 220,
    width: "minmax(220px, 1fr)",
  },
  {
    id: "effectiveDate",
    label: "Effective date",
    icon: CalendarDays,
    minWidth: 160,
    width: "minmax(140px, 180px)",
  },
];

const defaultLookupColumnVisibility: Record<LookupColumnKey, boolean> = {
  code: true,
  displayValueEn: true,
  displayValueFr: true,
  effectiveDate: true,
};

export function useLookupsTable(lookups: Lookup[]) {
  const [query, setQueryState] = useState("");
  const sort = useSortCycle<LookupSortKey>();
  const columnVisibility = useColumnVisibility({
    columns: lookupColumns,
    defaultVisibility: defaultLookupColumnVisibility,
  });
  const visibleColumns = useMemo(
    () =>
      lookupColumns.filter(
        (column) =>
          column.alwaysVisible || columnVisibility.columnVisibility[column.id],
      ),
    [columnVisibility.columnVisibility],
  );
  const tableGridStyle = useMemo(
    () => ({
      gridTemplateColumns: visibleColumns
        .map((column) => column.width)
        .join(" "),
    }),
    [visibleColumns],
  );
  const tableMinWidth = visibleColumns.reduce(
    (total, column) => total + column.minWidth,
    0,
  );
  const filteredLookups = useMemo(() => {
    return filterLookups({ lookups, query });
  }, [lookups, query]);
  const sortedLookups = useMemo(
    () => sortLookups(filteredLookups, sort.sortKey, sort.direction),
    [filteredLookups, sort.direction, sort.sortKey],
  );
  const pagination = usePagination({
    items: sortedLookups,
  });

  function setQuery(value: string) {
    setQueryState(value);
    pagination.resetPage();
  }

  function handleSort(key: LookupSortKey) {
    sort.handleSort(key);
    pagination.resetPage();
  }

  function handleColumnToggle(column: LookupColumnKey) {
    columnVisibility.toggleColumn(column);
    if (sort.sortKey === column) sort.resetSort();
  }

  return {
    columnVisibility,
    filteredLookups,
    handleColumnToggle,
    handleSort,
    pagination,
    query,
    setQuery,
    sort,
    sortedLookups,
    tableGridStyle,
    tableMinWidth,
    visibleColumns,
  };
}

export type LookupsTableState = ReturnType<typeof useLookupsTable>;
