import { LayoutGrid, List, MapPin } from "lucide-react";
import { provinceOptions } from "@/features/groups/components/constants";
import type { GroupsView } from "@/features/groups/components/types";
import { Combobox } from "@/components/ui/combobox";
import { SearchBar } from "@/components/ui/search-bar";

type GroupsToolbarProps = {
  province?: string;
  search: string;
  view: GroupsView;
  onProvinceChange: (province: string | null) => void;
  onSearchChange: (search: string) => void;
  onViewChange: (view: GroupsView) => void;
};

export function GroupsToolbar({
  province,
  search,
  view,
  onProvinceChange,
  onSearchChange,
  onViewChange,
}: GroupsToolbarProps) {
  return (
    <>
      <SearchBar
        value={search}
        onValueChange={onSearchChange}
        placeholder="Search groups..."
        ariaLabel="Search groups"
        className="min-w-lg"
      />
      <Combobox
        icon={MapPin}
        options={provinceOptions}
        value={province ?? null}
        onChange={onProvinceChange}
        placeholder="All provinces"
        searchPlaceholder="Filter province..."
        className="min-w-0 flex-1 sm:w-56 sm:flex-none"
      />
      <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
        <button
          onClick={() => onViewChange("grid")}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm ${
            view === "grid"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm ${
            view === "list"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
