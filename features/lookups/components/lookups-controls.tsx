import { Search } from "lucide-react";
import { ColumnVisibilityControl } from "@/components/ui/column-visibility-control";
import {
  lookupColumns,
  type LookupsTableState,
} from "@/features/lookups/use-lookups-table";

export function LookupsControls({
  disabled,
  hasLookupName,
  table,
}: {
  disabled: boolean;
  hasLookupName: boolean;
  table: LookupsTableState;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
      <label
        className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground focus-within:border-ring hover:bg-muted sm:min-w-[280px] ${
          !hasLookupName || disabled
            ? "cursor-not-allowed opacity-60 hover:bg-muted/40"
            : ""
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={table.query}
          disabled={!hasLookupName || disabled}
          onChange={(event) => {
            table.setQuery(event.target.value);
          }}
          placeholder="Search code, English, or French..."
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </label>
      <ColumnVisibilityControl
        columns={lookupColumns}
        visibleColumns={table.columnVisibility.visibleColumnIds}
        onToggle={table.handleColumnToggle}
        onReset={table.columnVisibility.resetColumnVisibility}
      />
    </div>
  );
}
