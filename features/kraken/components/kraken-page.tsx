import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ListFilter, Search } from "lucide-react";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { PageHeader } from "@/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameControls,
  PageFrameFooter,
} from "@/components/page-frame";
import { ColumnVisibilityControl } from "@/components/ui/column-visibility-control";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";
import { SortableTableHeader } from "@/components/ui/sortable-table-header";
import {
  krakenEntrypointRulesQueryOptions,
  getStaticKrakenEntrypoints,
} from "@/features/kraken/kraken-service";
import { ruleTypes, type Rule } from "@/lib/workspace-data";
import {
  ruleColumns,
  ruleTypeStyles,
  useKrakenRulesTable,
  type RuleColumnConfig,
  type RuleColumnKey,
} from "@/features/kraken/use-kraken-rules-table";

export function KrakenPage({ entrypointName }: { entrypointName?: string }) {
  const navigate = useNavigate();
  const entrypoints = useMemo(() => getStaticKrakenEntrypoints(), []);
  const {
    data,
    error: rulesError,
    isError: isRulesError,
    isFetching: isFetchingRules,
    isPending: isLoadingRules,
    refetch: refetchRules,
  } = useQuery({
    ...krakenEntrypointRulesQueryOptions(entrypointName ?? ""),
    enabled: Boolean(entrypointName),
  });
  const rules = data?.rules ?? [];
  const entrypoint = data?.entrypoint ?? null;
  const table = useKrakenRulesTable(rules);
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

  function handleEntrypointChange(value: string | null) {
    if (!value || value === entrypointName) return;

    table.pagination.resetPage();
    void navigate({
      to: "/kraken/$entrypointName",
      params: { entrypointName: value },
    });
  }

  return (
    <PageFrame>
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
            placeholder="Entrypoint name"
            searchPlaceholder="Search entrypoint names..."
            icon={ListFilter}
            className="min-w-0 flex-1 sm:min-w-[320px] sm:max-w-[420px]"
            align="right"
            clearable={false}
          />
        }
      />

      <PageFrameControls>
        <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
          <label
            className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground focus-within:border-ring hover:bg-muted sm:min-w-[260px] ${
              !entrypointName || isLoadingRules
                ? "cursor-not-allowed opacity-60 hover:bg-muted/40"
                : ""
            }`}
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={table.query}
              disabled={!entrypointName || isLoadingRules || isRulesError}
              onChange={(event) => {
                table.setQuery(event.target.value);
              }}
              placeholder="Search rules..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
          </label>
          <Combobox
            options={ruleTypeOptions}
            value={table.typeFilter}
            onChange={table.setTypeFilter}
            placeholder="All types"
            searchPlaceholder="Search rule types..."
            icon={ListFilter}
            className="min-w-0 flex-1 sm:w-44 sm:flex-none"
            align="right"
            disabled={!entrypointName || isLoadingRules || isRulesError}
          />
          <ColumnVisibilityControl
            columns={ruleColumns}
            visibleColumns={table.columnVisibility.visibleColumnIds}
            onToggle={table.handleColumnToggle}
            onReset={table.columnVisibility.resetColumnVisibility}
          />
        </div>
      </PageFrameControls>

      <PageFrameBody className="pb-8">
        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div style={{ minWidth: table.tableMinWidth }}>
            <div
              style={table.tableGridStyle}
              className="sticky top-0 z-10 grid border-b border-border/60 bg-background text-xs font-medium text-muted-foreground"
            >
              {table.visibleColumns.map((column, index) => (
                <RuleHeaderCell
                  key={column.id}
                  last={index === table.visibleColumns.length - 1}
                >
                  <SortableTableHeader
                    icon={column.icon}
                    label={column.label}
                    sortKey={column.id}
                    activeSort={table.sort.sortKey}
                    direction={table.sort.direction}
                    onSort={table.handleSort}
                    className="text-xs"
                  />
                </RuleHeaderCell>
              ))}
            </div>

            <div className="divide-y divide-border/60">
              {!entrypointName ? null : isLoadingRules ? (
                <RuleTablePending />
              ) : isRulesError ? (
                <DataErrorView
                  title="Could not load rules"
                  message={getErrorMessage(rulesError)}
                  onRetry={() => {
                    void refetchRules();
                  }}
                  isRetrying={isFetchingRules}
                />
              ) : (
                table.pagination.pageItems.map((rule) => (
                  <RuleRow
                    key={rule.id}
                    rule={rule}
                    columns={table.visibleColumns}
                    gridStyle={table.tableGridStyle}
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
              !isRulesError &&
              table.filteredRules.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No rules found
                </div>
              )}
          </div>
        </div>
      </PageFrameBody>

      {!isLoadingRules && !isRulesError && table.filteredRules.length > 0 && (
        <PageFrameFooter>
          <Pagination
            page={table.pagination.currentPage}
            pageCount={table.pagination.pageCount}
            total={table.sortedRules.length}
            pageSize={table.pagination.pageSize}
            onPageChange={table.pagination.setPage}
            onPageSizeChange={table.pagination.setPageSize}
            bordered={false}
          />
        </PageFrameFooter>
      )}
    </PageFrame>
  );
}

function RuleTablePending() {
  return (
    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
      Loading rules...
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

function RuleRow({
  columns,
  gridStyle,
  rule,
}: {
  columns: RuleColumnConfig[];
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
