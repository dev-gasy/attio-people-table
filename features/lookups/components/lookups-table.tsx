import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import {
  SortableTableHeader,
  TableBodyCell,
  TableHeaderCell,
  TableLoadingRows,
} from "@/components/ui/table";
import type { Lookup } from "@/features/lookups/lookup-mappers";
import {
  lookupNameCodeStyles,
  type LookupColumnConfig,
  type LookupColumnKey,
  type LookupsTableState,
} from "@/features/lookups/use-lookups-table";

const lookupLoadingWidths: Record<LookupColumnKey, string[]> = {
  code: ["h-5 w-24 rounded-md"],
  displayValueEn: ["h-3 w-40"],
  displayValueFr: ["h-3 w-40"],
  effectiveDate: ["h-3 w-24"],
  orderNo: ["h-3 w-12"],
};

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
          {!lookupName ? null : isLoading ? (
            <TableLoadingRows
              columns={table.visibleColumns.map((column) => ({
                key: column.id,
                widths: lookupLoadingWidths[column.id],
              }))}
              gridClassName="border-b-0"
              gridStyle={table.tableGridStyle}
              rowCount={table.pagination.pageSize}
            />
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
        <TableBodyCell key={column.id} last={index === columns.length - 1}>
          {renderLookupCell(lookup, column.id)}
        </TableBodyCell>
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
