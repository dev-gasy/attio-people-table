import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import {
  SortableTableHeader,
  TableBodyCell,
  TableHeaderCell,
  TableLoadingRows,
} from "@/components/ui/table";
import { type Rule } from "@/lib/workspace-data";
import {
  ruleTypeStyles,
  type KrakenRulesTableState,
  type RuleColumnConfig,
  type RuleColumnKey,
} from "@/features/kraken/use-kraken-rules-table";

const ruleLoadingWidths: Record<RuleColumnKey, string[]> = {
  name: ["h-3 w-48"],
  code: ["h-5 w-24 rounded-md"],
  message: ["h-3 w-40"],
  type: ["h-5 w-20 rounded-full"],
};

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
          className="sticky top-0 z-10 grid border-b border-border/60 bg-background"
        >
          {table.visibleColumns.map((column, index) => (
            <TableHeaderCell
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
              />
            </TableHeaderCell>
          ))}
        </div>

        <div className="divide-y divide-border/60">
          {!entrypointName ? null : isLoading ? (
            <TableLoadingRows
              columns={table.visibleColumns.map((column) => ({
                key: column.id,
                widths: ruleLoadingWidths[column.id],
              }))}
              gridClassName="border-b-0"
              gridStyle={table.tableGridStyle}
              rowCount={table.pagination.pageSize}
            />
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
        <TableBodyCell key={column.id} last={index === columns.length - 1}>
          {renderRuleCell(rule, column.id)}
        </TableBodyCell>
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
