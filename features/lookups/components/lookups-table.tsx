import { EmptyView } from "@/components/empty-view";
import { TanStackGridHeader, TanStackGridRows } from "@/components/ui/table";
import { type LookupsTableState } from "@/features/lookups/use-lookups-table";

type LookupsTableProps = {
  lookupName?: string;
  table: LookupsTableState;
};

export function LookupsTable({ lookupName, table }: LookupsTableProps) {
  const showHeader = lookupName && table.sortedRows.length > 0;
  return (
    <div
      style={{ transition: "opacity 0.2s ease" }}
      className={
        table.isStale ? "pointer-events-none opacity-50" : "opacity-100"
      }
    >
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
            {lookupName && (
              <TanStackGridRows
                rows={table.pagination.pageItems}
                gridStyle={table.tableGridStyle}
              />
            )}
          </div>
        </div>
      </div>

      {!lookupName && <EmptyView message="Select a lookup name" expanded />}

      {lookupName && table.sortedRows.length === 0 && (
        <EmptyView message="No lookups found" expanded />
      )}
    </div>
  );
}
