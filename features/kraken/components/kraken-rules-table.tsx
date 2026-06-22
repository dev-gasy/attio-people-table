import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { EmptyView } from "@/components/empty-view";
import {
  TanStackGridHeader,
  TanStackGridRows,
  TableLoadingRows,
} from "@/components/ui/table";
import { type KrakenRulesTableState } from "@/features/kraken/use-kraken-rules-table";

type KrakenRulesTableProps = {
  entrypointName?: string;
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  isRetrying: boolean;
  onRetry: () => void;
  table: KrakenRulesTableState;
};

export function KrakenRulesTable({
  entrypointName,
  error,
  isError,
  isLoading,
  isRetrying,
  onRetry,
  table,
}: KrakenRulesTableProps) {
  const showHeader =
    entrypointName && (isLoading || isError || table.sortedRows.length > 0);
  return (
    <div>
      <div className="overflow-auto rounded-xl border border-border bg-muted/10">
        <div style={{ minWidth: table.tableMinWidth }}>
          {showHeader && (
            <div
              style={table.tableGridStyle}
              className="sticky top-0 z-10 grid border-b border-border/60 bg-background"
            >
              <TanStackGridHeader table={table.table} />
            </div>
          )}

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
        </div>
      </div>

      {!entrypointName && (
        <EmptyView message="Select an entrypoint name" expanded />
      )}

      {entrypointName &&
        !isLoading &&
        !isError &&
        table.sortedRows.length === 0 && (
          <EmptyView message="No rules found" expanded />
        )}
    </div>
  );
}
