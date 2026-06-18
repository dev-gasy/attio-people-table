import { ChevronDown, ChevronRight, Plus, Table2 } from "lucide-react";

interface SidebarSectionsProps {
  groupOpen: boolean;
  pinnedOpen: boolean;
  onToggleGroup: () => void;
  onTogglePinned: () => void;
}

export function SidebarSections({
  groupOpen,
  pinnedOpen,
  onToggleGroup,
  onTogglePinned,
}: SidebarSectionsProps) {
  return (
    <>
      <div className="mt-6 px-3">
        <button
          onClick={onTogglePinned}
          className="flex w-full items-center gap-1.5 px-3 pb-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {pinnedOpen ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          Pinned Views
        </button>
        {pinnedOpen && <PinnedViews />}
      </div>

      <div className="mt-6 px-3">
        <div className="flex items-center justify-between px-3 pb-2">
          <button
            onClick={onToggleGroup}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {groupOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
            Group Title
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {groupOpen && <CollectionList />}
      </div>
    </>
  );
}

function PinnedViews() {
  return (
    <div className="flex flex-col gap-0.5">
      <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/60">
        <Table2 className="h-[18px] w-[18px] shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span className="font-medium">Candidate Pipeline</span>
        <span className="truncate text-xs text-muted-foreground">
          Ready for r...
        </span>
      </button>
      <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/60">
        <Table2 className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        <span className="font-medium">Sales</span>
        <span className="truncate text-xs text-muted-foreground">Top PQLs</span>
      </button>
    </div>
  );
}

function CollectionList() {
  return (
    <div className="flex flex-col gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <button
          key={i}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/60"
        >
          <span className="h-4 w-4 shrink-0 rounded border border-border" />
          <span>Collection</span>
          {i > 0 && (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      ))}
    </div>
  );
}
