import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

type WorkspaceHeaderProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function WorkspaceHeader({
  collapsed,
  onToggleCollapse,
}: WorkspaceHeaderProps) {
  return (
    <div
      className={`flex h-[var(--page-frame-header-height,4.5rem)] border-b border-sidebar-border px-4 ${
        collapsed
          ? "flex-col items-center justify-center gap-1.5"
          : "items-center justify-between"
      }`}
    >
      <div
        className={`flex min-w-0 items-center ${
          collapsed ? "justify-center" : "gap-2.5"
        }`}
      >
        {!collapsed && (
          <>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden">
              <img
                src="/icon.svg"
                alt=""
                className="h-7 w-7"
                aria-hidden="true"
              />
            </span>
            <span className="min-w-0 truncate text-[15px] font-semibold text-sidebar-foreground">
              attio
            </span>
          </>
        )}
      </div>
      <button
        onClick={onToggleCollapse}
        className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-[18px] w-[18px]" />
        ) : (
          <PanelLeftClose className="h-[18px] w-[18px]" />
        )}
      </button>
    </div>
  );
}
