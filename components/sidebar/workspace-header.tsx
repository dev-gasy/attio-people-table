"use client";

import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function WorkspaceHeader({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3.5">
      {!collapsed && (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-emerald-400">
            <span className="text-sm font-bold text-background">A</span>
          </div>
          <span className="text-[15px] font-semibold text-sidebar-foreground">
            attio
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <button
        onClick={onToggleCollapse}
        className={`rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground ${
          collapsed ? "mx-auto" : ""
        }`}
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
