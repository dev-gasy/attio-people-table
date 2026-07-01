import { ColumnVisibilityControl } from "@/shared/components/ui/column-visibility-control";
import { SearchBar } from "@/shared/components/ui/search-bar";
import {
  lookupColumns,
  type LookupsTableState,
} from "@/features/lookups/use-lookups-table";

type LookupsControlsProps = {
  disabled: boolean;
  hasLookupName: boolean;
  table: LookupsTableState;
};

export function LookupsControls({
  disabled,
  hasLookupName,
  table,
}: LookupsControlsProps) {
  return (
    <div className="flex w-full min-w-0 items-center gap-3 text-sm text-muted-foreground">
      <SearchBar
        value={table.query}
        disabled={!hasLookupName || disabled}
        onValueChange={table.setQuery}
        placeholder="Search order, code, English, or French..."
        className="min-w-0 flex-1"
      />
      <div className="shrink-0">
        <ColumnVisibilityControl
          columns={lookupColumns}
          visibleColumns={table.columnVisibility.visibleColumnIds}
          onToggle={table.handleColumnToggle}
          onReset={table.columnVisibility.resetColumnVisibility}
        />
      </div>
    </div>
  );
}
