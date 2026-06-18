import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { EmptyView } from "@/components/empty-view";
import {
  TanStackGridHeader,
  TanStackGridRows,
  TableLoadingRows,
} from "@/components/ui/table";
import { type CustomerTableState } from "@/features/customers/hooks/use-customer-table";

interface CustomerTableProps {
  shouldLoadCustomers: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isRetrying: boolean;
  idleMessage: string;
  emptyMessage: string;
  onRetry: () => void;
  table: CustomerTableState;
}

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
}: CustomerTableProps) {
  const isEmpty = !isLoading && !isError && table.sortedRows.length === 0;
  const emptyMessage_ = shouldLoadCustomers ? emptyMessage : idleMessage;

  if (!shouldLoadCustomers || isEmpty) {
    return <EmptyView message={emptyMessage_} />;
  }

  const showHeader = isLoading || isError || table.sortedRows.length > 0;

  return (
    <div className="min-h-0">
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

          {isLoading ? (
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
        </div>
      </div>
    </div>
  );
}
