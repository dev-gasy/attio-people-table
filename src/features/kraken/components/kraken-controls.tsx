import { ListFilter } from "lucide-react";
import { ColumnVisibilityControl } from "@/shared/components/ui/column-visibility-control";
import { Combobox, type ComboOption } from "@/shared/components/ui/combobox";
import { SearchBar } from "@/shared/components/ui/search-bar";
import {
  ruleColumns,
  type KrakenRulesTableState,
} from "@/features/kraken/use-kraken-rules-table";

type KrakenControlsProps = {
  disabled: boolean;
  hasEntrypoint: boolean;
  ruleTypeOptions: ComboOption[];
  table: KrakenRulesTableState;
};

export function KrakenControls({
  disabled,
  hasEntrypoint,
  ruleTypeOptions,
  table,
}: KrakenControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
      <SearchBar
        value={table.query}
        disabled={!hasEntrypoint || disabled}
        onValueChange={table.setQuery}
        placeholder="Search rules..."
        className="flex-1 sm:min-w-65"
      />
      <Combobox
        options={ruleTypeOptions}
        value={table.typeFilter}
        onChange={table.setTypeFilter}
        placeholder="All types"
        searchPlaceholder="Search rule types..."
        icon={ListFilter}
        className="min-w-0 flex-1 sm:w-44 sm:flex-none"
        align="right"
        disabled={!hasEntrypoint || disabled}
      />
      <ColumnVisibilityControl
        columns={ruleColumns}
        visibleColumns={table.columnVisibility.visibleColumnIds}
        onToggle={table.handleColumnToggle}
        onReset={table.columnVisibility.resetColumnVisibility}
      />
    </div>
  );
}
