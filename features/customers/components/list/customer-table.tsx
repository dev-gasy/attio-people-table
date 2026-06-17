import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import {
  TanStackGridHeader,
  TanStackGridRows,
  TableLoadingRows,
} from "@/components/ui/table";
import { type CustomerTableState } from "@/features/customers/hooks/use-customer-table";

export function CustomerTable({
  shouldLoadCustomers,
  isLoading,
  isError,
  error,
  isRetrying,
  idleMessage,
  emptyMessage,
  onRetry,
  table,
}: {
  shouldLoadCustomers: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isRetrying: boolean;
  idleMessage: string;
  emptyMessage: string;
  onRetry: () => void;
  table: CustomerTableState;
}) {
  return (
    <div className="min-h-0">
      <div className="overflow-auto rounded-xl border border-border bg-muted/10">
        <div className="w-full min-w-0">
          <div
            style={table.tableGridStyle}
            className="sticky top-0 z-10 grid border-b border-border/60 bg-background"
          >
            <TanStackGridHeader table={table.table} />
          </div>

          {!shouldLoadCustomers ? (
            <CustomerTableEmptyState message={idleMessage} />
          ) : isLoading ? (
            <TableLoadingRows
              columns={table.visibleColumns.map((column) => ({
                key: column.id,
                widths: column.columnDef.meta?.loadingWidths ?? ["h-3 w-24"],
              }))}
              gridStyle={table.tableGridStyle}
              rowCount={table.pagination.pageSize}
            />
          ) : isError ? (
            <DataErrorView
              title="Could not load customers"
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

          {shouldLoadCustomers &&
            !isLoading &&
            !isError &&
            table.sortedRows.length === 0 && (
              <CustomerTableEmptyState message={emptyMessage} />
            )}
        </div>
      </div>
    </div>
  );
}

function CustomerTableEmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
