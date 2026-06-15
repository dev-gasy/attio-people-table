import { ColumnVisibilityControl } from "@/components/ui/column-visibility-control";
import { SearchBar } from "@/components/ui/search-bar";
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
      <SearchBar
        value={table.query}
        disabled={!hasLookupName || disabled}
        onValueChange={table.setQuery}
        placeholder="Search order, code, English, or French..."
        className="flex-1 sm:min-w-[280px]"
      />
      <ColumnVisibilityControl
        columns={lookupColumns}
        visibleColumns={table.columnVisibility.visibleColumnIds}
        onToggle={table.handleColumnToggle}
        onReset={table.columnVisibility.resetColumnVisibility}
      />
    </div>
  );
}
