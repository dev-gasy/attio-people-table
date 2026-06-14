"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  FileText,
  Hash,
  ListFilter,
  MessageSquareText,
  Search,
  Tags,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  ColumnVisibilityControl,
  type ColumnVisibilityOption,
} from "@/components/ui/column-visibility-control";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";
import {
  SortableTableHeader,
  type TableSortDirection,
} from "@/components/ui/sortable-table-header";
import {
  krakenEntrypointRulesQueryOptions,
  krakenEntrypointsQueryOptions,
} from "@/features/kraken/kraken-service";
import { ruleTypes, type Rule, type RuleType } from "@/lib/workspace-data";

const RULES_PAGE_SIZE = 16;

type RuleSortKey = "name" | "code" | "message" | "type";
type RuleColumnKey = RuleSortKey;

const ruleTypeStyles: Record<RuleType, string> = {
  Required: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Validation: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Reset: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Set: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const ruleColumns: Array<
  ColumnVisibilityOption<RuleColumnKey> & {
    icon: React.ComponentType<{ className?: string }>;
    minWidth: number;
    width: string;
  }
> = [
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

export function KrakenPage({ entrypointName }: { entrypointName?: string }) {
  const navigate = useNavigate();
  const { data: entrypoints = [], isPending: isLoadingEntrypoints } = useQuery(
    krakenEntrypointsQueryOptions(),
  );
  const { data, isPending: isLoadingRules } = useQuery({
    ...krakenEntrypointRulesQueryOptions(entrypointName ?? ""),
    enabled: Boolean(entrypointName),
  });
  const rules = data?.rules ?? [];
  const entrypoint = data?.entrypoint ?? null;
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<RuleSortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<TableSortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(RULES_PAGE_SIZE);
  const [columnVisibility, setColumnVisibility] = useState(
    defaultRuleColumnVisibility,
  );
  const normalizedQuery = query.trim().toLowerCase();
  const entrypointOptions: ComboOption[] = entrypoints.map((entrypoint) => ({
    value: entrypoint.slug,
    label: entrypoint.name,
    hint: `${entrypoint.rulesCount} rules`,
  }));
  const ruleTypeOptions: ComboOption[] = ruleTypes.map((type) => ({
    value: type,
    label: type,
    hint: `${rules.filter((rule) => rule.type === type).length} rules`,
  }));
  const visibleColumns = useMemo(
    () =>
      ruleColumns.filter(
        (column) => column.alwaysVisible || columnVisibility[column.id],
      ),
    [columnVisibility],
  );
  const visibleColumnIds = useMemo(
    () => new Set(visibleColumns.map((column) => column.id)),
    [visibleColumns],
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
    return rules.filter((rule) => {
      const matchesType = !typeFilter || rule.type === typeFilter;
      const matchesQuery =
        !normalizedQuery ||
        [rule.name, rule.code, rule.message].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return matchesType && matchesQuery;
    });
  }, [normalizedQuery, rules, typeFilter]);

  const sortedRules = useMemo(
    () => sortRules(filteredRules, sortKey, sortDirection),
    [filteredRules, sortDirection, sortKey],
  );

  const pageCount = Math.max(1, Math.ceil(sortedRules.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRules = useMemo(
    () =>
      sortedRules.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize, sortedRules],
  );

  function handleEntrypointChange(value: string | null) {
    if (!value || value === entrypointName) return;

    setPage(1);
    void navigate({
      to: "/kraken/$entrypointName",
      params: { entrypointName: value },
    });
  }

  function handleTypeChange(value: string | null) {
    setTypeFilter(value);
    setPage(1);
  }

  function handleSort(key: RuleSortKey) {
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

  function handleColumnToggle(column: RuleColumnKey) {
    const columnConfig = ruleColumns.find((item) => item.id === column);
    if (columnConfig?.alwaysVisible) return;

    setColumnVisibility((visibility) => ({
      ...visibility,
      [column]: !visibility[column],
    }));
    if (sortKey === column) {
      setSortKey(null);
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Kraken"
        badge={
          entrypoint ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {entrypoint.name}
            </span>
          ) : null
        }
        actions={
          <Combobox
            options={entrypointOptions}
            value={entrypointName ?? null}
            onChange={handleEntrypointChange}
            placeholder={
              isLoadingEntrypoints
                ? "Loading entrypoints..."
                : "Entrypoint name"
            }
            searchPlaceholder="Search entrypoint names..."
            icon={ListFilter}
            className="min-w-0 flex-1 sm:min-w-[320px] sm:max-w-[420px]"
            align="right"
            clearable={false}
            disabled={isLoadingEntrypoints}
          />
        }
      />

      <div className="flex-1 overflow-auto px-6 pt-1 pb-8">
        <div className="mb-3 flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
          <label
            className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground focus-within:border-ring hover:bg-muted sm:min-w-[260px] ${
              !entrypointName || isLoadingRules
                ? "cursor-not-allowed opacity-60 hover:bg-muted/40"
                : ""
            }`}
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              disabled={!entrypointName || isLoadingRules}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search rules..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </label>
          <Combobox
            options={ruleTypeOptions}
            value={typeFilter}
            onChange={handleTypeChange}
            placeholder="All types"
            searchPlaceholder="Search rule types..."
            icon={ListFilter}
            className="min-w-0 flex-1 sm:w-44 sm:flex-none"
            align="right"
            disabled={!entrypointName || isLoadingRules}
          />
          <ColumnVisibilityControl
            columns={ruleColumns}
            visibleColumns={visibleColumnIds}
            onToggle={handleColumnToggle}
            onReset={() => {
              setColumnVisibility(defaultRuleColumnVisibility);
            }}
          />
        </div>

        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div style={{ minWidth: tableMinWidth }}>
            <div
              style={tableGridStyle}
              className="sticky top-0 z-10 grid border-b border-border/60 bg-background text-xs font-medium text-muted-foreground"
            >
              {visibleColumns.map((column, index) => (
                <RuleHeaderCell
                  key={column.id}
                  last={index === visibleColumns.length - 1}
                >
                  <SortableTableHeader
                    icon={column.icon}
                    label={column.label}
                    sortKey={column.id}
                    activeSort={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                    className="text-xs"
                  />
                </RuleHeaderCell>
              ))}
            </div>

            <div className="divide-y divide-border/60">
              {!entrypointName ? null : isLoadingRules ? (
                <RuleTablePending />
              ) : (
                pageRules.map((rule) => (
                  <RuleRow
                    key={rule.id}
                    rule={rule}
                    columns={visibleColumns}
                    gridStyle={tableGridStyle}
                  />
                ))
              )}
            </div>

            {!entrypointName && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                Select an entrypoint name
              </div>
            )}

            {entrypointName &&
              !isLoadingRules &&
              filteredRules.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No rules found
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-3">
        {!isLoadingRules && filteredRules.length > 0 && (
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            total={sortedRules.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            bordered={false}
            className="min-w-0 flex-1 px-0 py-0 sm:min-w-[320px]"
          />
        )}
      </div>
    </div>
  );
}

function RuleTablePending() {
  return (
    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
      Loading rules...
    </div>
  );
}

export function KrakenPageLoading() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader title="Kraken" />
      <div className="flex-1 overflow-auto px-6 pt-4 pb-8">
        <div className="overflow-hidden rounded-xl border border-border bg-muted/10">
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Loading rules...
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleHeaderCell({
  children,
  last,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center px-4 py-2.5 ${
        last ? "" : "border-r border-border/60"
      }`}
    >
      {children}
    </div>
  );
}

function sortRules(
  ruleList: Rule[],
  sortKey: RuleSortKey | null,
  direction: TableSortDirection,
) {
  if (!sortKey) return ruleList;

  return [...ruleList].sort((a, b) => {
    const result =
      getRuleSortValue(a, sortKey).localeCompare(
        getRuleSortValue(b, sortKey),
        undefined,
        { numeric: true, sensitivity: "base" },
      ) || a.id - b.id;

    return direction === "asc" ? result : -result;
  });
}

function getRuleSortValue(rule: Rule, sortKey: RuleSortKey) {
  return rule[sortKey];
}

function RuleRow({
  columns,
  gridStyle,
  rule,
}: {
  columns: typeof ruleColumns;
  gridStyle: React.CSSProperties;
  rule: Rule;
}) {
  return (
    <div style={gridStyle} className="grid text-sm hover:bg-muted/30">
      {columns.map((column, index) => (
        <RuleCell key={column.id} last={index === columns.length - 1}>
          {renderRuleCell(rule, column.id)}
        </RuleCell>
      ))}
    </div>
  );
}

function renderRuleCell(rule: Rule, column: RuleColumnKey) {
  if (column === "name") {
    return (
      <span className="min-w-0 whitespace-normal break-words font-medium leading-5 text-foreground">
        {rule.name}
      </span>
    );
  }

  if (column === "code") {
    return (
      <code className="min-w-0 truncate rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
        {rule.code}
      </code>
    );
  }

  if (column === "message") {
    return (
      <span className="min-w-0 truncate text-muted-foreground">
        {rule.message}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
        ruleTypeStyles[rule.type]
      }`}
    >
      {rule.type}
    </span>
  );
}

function RuleCell({
  children,
  last,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center px-4 py-2.5 ${
        last ? "" : "border-r border-border/60"
      }`}
    >
      {children}
    </div>
  );
}
