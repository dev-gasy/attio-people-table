import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { SortableTableHeader } from "@/components/ui/sortable-table-header";
import type { Lookup } from "@/features/lookups/lookup-mappers";
import {
  lookupNameCodeStyles,
  type LookupColumnConfig,
  type LookupColumnKey,
  type LookupsTableState,
} from "@/features/lookups/use-lookups-table";

export function LookupsTable({
  error,
  isError,
  isLoading,
  isRetrying,
  lookupName,
  onRetry,
  table,
}: {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  isRetrying: boolean;
  lookupName?: string;
  onRetry: () => void;
  table: LookupsTableState;
}) {
  return (
    <div className="overflow-auto rounded-xl border border-border bg-muted/10">
      <div style={{ minWidth: table.tableMinWidth }}>
        <div
          style={table.tableGridStyle}
          className="sticky top-0 z-10 grid border-b border-border/60 bg-background text-xs font-medium text-muted-foreground"
        >
          {table.visibleColumns.map((column, index) => (
            <LookupHeaderCell
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
            </LookupHeaderCell>
          ))}
        </div>

        <div className="divide-y divide-border/60">
          {!lookupName ? null : isLoading ? (
            <LookupTablePending />
          ) : isError ? (
            <DataErrorView
              title="Could not load lookups"
              message={getErrorMessage(error)}
              onRetry={onRetry}
              isRetrying={isRetrying}
            />
          ) : (
            table.pagination.pageItems.map((lookup) => (
              <LookupRow
                key={lookup.id}
                lookup={lookup}
                columns={table.visibleColumns}
                gridStyle={table.tableGridStyle}
              />
            ))
          )}
        </div>

        {!lookupName && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Select a lookup name
          </div>
        )}

        {lookupName &&
          !isLoading &&
          !isError &&
          table.filteredLookups.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No lookups found
            </div>
          )}
      </div>
    </div>
  );
}

function LookupTablePending() {
  return (
    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
      Loading lookups...
    </div>
  );
}

function LookupHeaderCell({
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

function LookupRow({
  columns,
  gridStyle,
  lookup,
}: {
  columns: LookupColumnConfig[];
  gridStyle: React.CSSProperties;
  lookup: Lookup;
}) {
  return (
    <div style={gridStyle} className="grid text-sm hover:bg-muted/30">
      {columns.map((column, index) => (
        <LookupCell key={column.id} last={index === columns.length - 1}>
          {renderLookupCell(lookup, column.id)}
        </LookupCell>
      ))}
    </div>
  );
}

function renderLookupCell(lookup: Lookup, column: LookupColumnKey) {
  if (column === "orderNo") {
    return (
      <span className="min-w-0 truncate text-muted-foreground">
        {lookup.orderNo}
      </span>
    );
  }

  if (column === "code") {
    return (
      <code
        className={`min-w-0 truncate rounded-md px-2 py-0.5 text-xs ${
          lookupNameCodeStyles[lookup.lookupName] ??
          "bg-muted text-muted-foreground"
        }`}
      >
        {lookup.code}
      </code>
    );
  }

  if (column === "displayValueEn") {
    return (
      <span className="min-w-0 truncate text-foreground">
        {lookup.displayValueEn}
      </span>
    );
  }

  if (column === "displayValueFr") {
    return (
      <span className="min-w-0 truncate text-muted-foreground">
        {lookup.displayValueFr}
      </span>
    );
  }

  return (
    <span className="min-w-0 truncate text-muted-foreground">
      {lookup.effectiveDate}
    </span>
  );
}

function LookupCell({
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
