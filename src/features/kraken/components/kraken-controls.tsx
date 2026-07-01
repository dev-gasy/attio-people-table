import { ListFilter } from "lucide-react";
import { Combobox, type ComboOption } from "@/shared/components/ui/combobox";
import { SearchBar } from "@/shared/components/ui/search-bar";
import { type KrakenRulesListState } from "@/features/kraken/use-kraken-rules-table";

type KrakenControlsProps = {
  disabled: boolean;
  entrypointOptions: ComboOption[];
  ruleTypeOptions: ComboOption[];
  list: KrakenRulesListState;
};

export function KrakenControls({
  disabled,
  entrypointOptions,
  ruleTypeOptions,
  list,
}: KrakenControlsProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_18rem_11rem]">
      <SearchBar
        value={list.query}
        disabled={disabled}
        onValueChange={list.setQuery}
        placeholder="Search rules..."
        className="w-full sm:col-span-2 xl:col-span-1"
      />
      <Combobox
        options={entrypointOptions}
        value={list.entrypointFilter}
        onChange={list.setEntrypointFilter}
        placeholder="All entrypoints"
        searchPlaceholder="Search entrypoint names..."
        icon={ListFilter}
        className="min-w-0"
        align="right"
        disabled={disabled}
      />
      <Combobox
        options={ruleTypeOptions}
        value={list.typeFilter}
        onChange={list.setTypeFilter}
        placeholder="All statuses"
        searchPlaceholder="Search statuses..."
        icon={ListFilter}
        className="min-w-0"
        align="right"
        disabled={disabled}
      />
    </div>
  );
}
