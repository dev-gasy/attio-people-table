import { useDeferredValue, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { FileText, Hash, MessageSquareText, Tags } from "lucide-react";
import { filterRules, type RuleSortKey } from "@/features/kraken/domain/rules";
import type {
  KrakenRule,
  RuleType,
} from "@/features/kraken/services/kraken.types";
import { useColumnVisibility } from "@/hooks/use-column-visibility";
import { useTanStackClientTable } from "@/hooks/use-tanstack-client-table";

export type RuleColumnKey = RuleSortKey;

export const ruleTypeStyles: Record<RuleType, string> = {
  Required: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Validation: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Reset: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Set: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const ruleTableColumns = [
  {
    accessorKey: "name",
    id: "name",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => (
      <span className="min-w-0 whitespace-normal break-words font-medium leading-5 text-foreground">
        {getValue<string>()}
      </span>
    ),
    meta: {
      alwaysVisible: true,
      icon: FileText,
      label: "Name",
      loadingWidths: ["h-3 w-48"],
      minWidth: 280,
      width: "minmax(280px, 1.5fr)",
    },
  },
  {
    accessorKey: "code",
    id: "code",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => (
      <code className="min-w-0 truncate rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
        {getValue<string>()}
      </code>
    ),
    meta: {
      icon: Hash,
      label: "Code",
      loadingWidths: ["h-5 w-24 rounded-md"],
      minWidth: 150,
      width: "minmax(130px, 170px)",
    },
  },
  {
    accessorKey: "message",
    id: "message",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => (
      <span className="min-w-0 truncate text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
    meta: {
      icon: MessageSquareText,
      label: "Message",
      loadingWidths: ["h-3 w-40"],
      minWidth: 180,
      width: "minmax(180px, 0.65fr)",
    },
  },
  {
    accessorKey: "type",
    id: "type",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => {
      const type = getValue<RuleType>();

      return (
        <span
          className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${ruleTypeStyles[type]}`}
        >
          {type}
        </span>
      );
    },
    meta: {
      icon: Tags,
      label: "Type",
      loadingWidths: ["h-5 w-20 rounded-full"],
      minWidth: 150,
      width: "minmax(120px, 150px)",
    },
  },
] satisfies ColumnDef<KrakenRule>[];

export const ruleColumns = ruleTableColumns.map((column) => ({
  id: column.id as RuleColumnKey,
  label: column.meta?.label ?? column.id,
  alwaysVisible: column.meta?.alwaysVisible,
}));

const defaultRuleColumnVisibility: Record<RuleColumnKey, boolean> = {
  name: true,
  code: true,
  message: true,
  type: true,
};

export function useKrakenRulesTable(rules: KrakenRule[]) {
  const [typeFilter, setTypeFilterState] = useState<RuleType | null>(null);
  const [query, setQueryState] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = deferredQuery !== query;

  const columnVisibility = useColumnVisibility({
    columns: ruleColumns,
    defaultVisibility: defaultRuleColumnVisibility,
  });

  const filteredRules = useMemo(() => {
    return filterRules({ rules, query: deferredQuery, typeFilter });
  }, [deferredQuery, rules, typeFilter]);

  const table = useTanStackClientTable({
    data: filteredRules,
    columns: ruleTableColumns,
    columnVisibility: columnVisibility.columnVisibility,
    getRowId: (row) => String(row.id),
  });

  function setQuery(value: string) {
    setQueryState(value);
  }

  function setTypeFilter(value: string | null) {
    setTypeFilterState(value as RuleType | null);
  }

  function handleColumnToggle(column: RuleColumnKey) {
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
    setTypeFilter,
    sort: table.sort,
    sortedRows: table.sortedRows,
    table: table.table,
    tableGridStyle: table.tableGridStyle,
    tableMinWidth: table.tableMinWidth,
    typeFilter,
    visibleColumns: table.visibleColumns,
  };
}

export type KrakenRulesTableState = ReturnType<typeof useKrakenRulesTable>;
