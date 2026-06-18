import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { EmptyView } from "@/components/empty-view";
import {
  TanStackGridHeader,
  TanStackGridRows,
  TableLoadingRows,
} from "@/components/ui/table";
import { type LookupsTableState } from "@/features/lookups/use-lookups-table";

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
          <TanStackGridHeader table={table.table} />
        </div>

        <div className="divide-y divide-border/60">
          {!lookupName ? null : isLoading ? (
            <TableLoadingRows
              columns={table.visibleColumns.map((column) => ({
                key: column.id,
                widths: column.columnDef.meta?.loadingWidths ?? ["h-3 w-24"],
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
            <TanStackGridRows
              rows={table.pagination.pageItems}
              gridStyle={table.tableGridStyle}
            />
          )}
        </div>

        {!lookupName && <EmptyView message="Select a lookup name" />}

        {lookupName &&
          !isLoading &&
          !isError &&
          table.sortedRows.length === 0 && (
            <EmptyView message="No lookups found" />
          )}
      </div>
    </div>
  );
}
