import { Search } from "lucide-react";

export function SidebarSearch({
  collapsed,
  onOpen,
}: {
  collapsed: boolean;
  onOpen: () => void;
}) {
  return (
    <div className="px-3 py-3">
      {collapsed ? (
        <button
          onClick={onOpen}
          className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border bg-background/40 text-muted-foreground hover:text-foreground"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      ) : (
        <button
          onClick={onOpen}
          className="flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-background/40 px-3 py-2 text-left hover:border-sidebar-ring/50 hover:text-foreground"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search</span>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[11px]">⌘</kbd>
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[11px]">K</kbd>
          </div>
        </button>
      )}
    </div>
  );
}
