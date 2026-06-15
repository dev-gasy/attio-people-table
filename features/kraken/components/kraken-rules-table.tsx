import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { SortableTableHeader } from "@/components/ui/sortable-table-header";
import { type Rule } from "@/lib/workspace-data";
import {
  ruleTypeStyles,
  type KrakenRulesTableState,
  type RuleColumnConfig,
  type RuleColumnKey,
} from "@/features/kraken/use-kraken-rules-table";

export function KrakenRulesTable({
  entrypointName,
  error,
  isError,
  isLoading,
  isRetrying,
  onRetry,
  table,
}: {
  entrypointName?: string;
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  isRetrying: boolean;
  onRetry: () => void;
  table: KrakenRulesTableState;
}) {
  return (
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
          {!entrypointName ? null : isLoading ? (
            <RuleTablePending />
          ) : isError ? (
            <DataErrorView
              title="Could not load rules"
              message={getErrorMessage(error)}
              onRetry={onRetry}
              isRetrying={isRetrying}
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
          !isLoading &&
          !isError &&
          table.filteredRules.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No rules found
            </div>
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
