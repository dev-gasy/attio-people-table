import { ListFilter, Search } from "lucide-react";
import { ColumnVisibilityControl } from "@/components/ui/column-visibility-control";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import {
  ruleColumns,
  type KrakenRulesTableState,
} from "@/features/kraken/use-kraken-rules-table";

export function KrakenControls({
  disabled,
  hasEntrypoint,
  ruleTypeOptions,
  table,
}: {
  disabled: boolean;
  hasEntrypoint: boolean;
  ruleTypeOptions: ComboOption[];
  table: KrakenRulesTableState;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
      <label
        className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground focus-within:border-ring hover:bg-muted sm:min-w-[260px] ${
          !hasEntrypoint || disabled
            ? "cursor-not-allowed opacity-60 hover:bg-muted/40"
            : ""
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={table.query}
          disabled={!hasEntrypoint || disabled}
          onChange={(event) => {
            table.setQuery(event.target.value);
          }}
          placeholder="Search rules..."
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </label>
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
