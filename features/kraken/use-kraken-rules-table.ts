import { useMemo, useState, type ComponentType } from "react";
import { FileText, Hash, MessageSquareText, Tags } from "lucide-react";
import type { ColumnVisibilityOption } from "@/components/ui/column-visibility-control";
import { type Rule, type RuleType } from "@/lib/workspace-data";
import {
  filterRules,
  sortRules,
  type RuleSortKey,
} from "@/features/kraken/kraken-domain/rules";
import { useColumnVisibility } from "@/hooks/use-column-visibility";
import { usePagination } from "@/hooks/use-pagination";
import { useSortCycle } from "@/hooks/use-sort-cycle";

export type RuleColumnKey = RuleSortKey;

export type RuleColumnConfig = ColumnVisibilityOption<RuleColumnKey> & {
  icon: ComponentType<{ className?: string }>;
  minWidth: number;
  width: string;
};

export const ruleTypeStyles: Record<RuleType, string> = {
  Required: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Validation: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Reset: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Set: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export const ruleColumns: RuleColumnConfig[] = [
  {
    id: "name",
    label: "Name",
    icon: FileText,
    minWidth: 280,
    width: "minmax(280px, 1.5fr)",
    alwaysVisible: true,
  },
  {
    id: "code",
    label: "Code",
    icon: Hash,
    minWidth: 150,
    width: "minmax(130px, 170px)",
  },
  {
    id: "message",
    label: "Message",
    icon: MessageSquareText,
    minWidth: 180,
    width: "minmax(180px, 0.65fr)",
  },
  {
    id: "type",
    label: "Type",
    icon: Tags,
    minWidth: 150,
    width: "minmax(120px, 150px)",
  },
];

const defaultRuleColumnVisibility: Record<RuleColumnKey, boolean> = {
  name: true,
  code: true,
  message: true,
  type: true,
};

export function useKrakenRulesTable(rules: Rule[]) {
  const [typeFilter, setTypeFilterState] = useState<RuleType | null>(null);
  const [query, setQueryState] = useState("");
  const sort = useSortCycle<RuleSortKey>();
  const columnVisibility = useColumnVisibility({
    columns: ruleColumns,
    defaultVisibility: defaultRuleColumnVisibility,
  });
  const visibleColumns = useMemo(
    () =>
      ruleColumns.filter(
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
  const filteredRules = useMemo(() => {
    return filterRules({ rules, query, typeFilter });
  }, [query, rules, typeFilter]);
  const sortedRules = useMemo(
    () => sortRules(filteredRules, sort.sortKey, sort.direction),
    [filteredRules, sort.direction, sort.sortKey],
  );
  const pagination = usePagination({
    items: sortedRules,
  });

  function setQuery(value: string) {
    setQueryState(value);
    pagination.resetPage();
  }

  function setTypeFilter(value: string | null) {
    setTypeFilterState(value as RuleType | null);
    pagination.resetPage();
  }

  function handleSort(key: RuleSortKey) {
    sort.handleSort(key);
    pagination.resetPage();
  }

  function handleColumnToggle(column: RuleColumnKey) {
    columnVisibility.toggleColumn(column);
    if (sort.sortKey === column) sort.resetSort();
  }

  return {
    columnVisibility,
    filteredRules,
    handleColumnToggle,
    handleSort,
    pagination,
    query,
    setQuery,
    setTypeFilter,
    sort,
    sortedRules,
    tableGridStyle,
    tableMinWidth,
    typeFilter,
    visibleColumns,
  };
}

export type KrakenRulesTableState = ReturnType<typeof useKrakenRulesTable>;
