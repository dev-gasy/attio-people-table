import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import {
  TanStackGridHeader,
  TanStackGridRows,
  TableLoadingRows,
} from "@/components/ui/table";
import { type KrakenRulesTableState } from "@/features/kraken/use-kraken-rules-table";

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
          <TanStackGridHeader table={table.table} />
        </div>

        <div className="divide-y divide-border/60">
          {!entrypointName ? null : isLoading ? (
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
              title="Could not load rules"
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

        {!entrypointName && (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Select an entrypoint name
          </div>
        )}

        {entrypointName &&
          !isLoading &&
          !isError &&
          table.sortedRows.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No rules found
            </div>
          )}
      </div>
    </div>
  );
}
