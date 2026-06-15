import { Filter, LayoutGrid, List, Plus } from "lucide-react";
import type { GroupStatus } from "@/features/groups/group-mappers";
import { statusOptions } from "@/features/groups/components/constants";
import type { GroupsView } from "@/features/groups/components/types";
import { Combobox } from "@/components/ui/combobox";

export function GroupsToolbar({
  statusFilter,
  view,
  onAdd,
  onStatusFilterChange,
  onViewChange,
}: {
  statusFilter?: GroupStatus;
  view: GroupsView;
  onAdd: () => void;
  onStatusFilterChange: (status?: GroupStatus) => void;
  onViewChange: (view: GroupsView) => void;
}) {
  return (
    <>
      <Combobox
        icon={Filter}
        options={statusOptions}
        value={statusFilter as string | null}
        onChange={(v) =>
          onStatusFilterChange((v as GroupStatus | null) ?? undefined)
        }
        placeholder="All statuses"
        searchPlaceholder="Filter status..."
        className="w-44"
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
      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Add
      </button>
    </>
  );
}
