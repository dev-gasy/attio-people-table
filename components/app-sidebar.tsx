"use client";

import { useState } from "react";
import { PrimaryNav } from "@/components/sidebar/primary-nav";
import { SidebarFooter } from "@/components/sidebar/sidebar-footer";
import { SidebarSearch } from "@/components/sidebar/sidebar-search";
import { SidebarSections } from "@/components/sidebar/sidebar-sections";
import { WorkspaceHeader } from "@/components/sidebar/workspace-header";
import type { PageId } from "@/components/sidebar/types";

export type { PageId, PagePath } from "@/components/sidebar/types";

export function AppSidebar({
  activePage,
  collapsed,
  onToggleCollapse,
}: {
  activePage: PageId;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [groupOpen, setGroupOpen] = useState(true);

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ${
        collapsed ? "w-[68px]" : "w-72"
      }`}
    >
      <WorkspaceHeader
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />
      <SidebarSearch collapsed={collapsed} />
      <PrimaryNav activePage={activePage} collapsed={collapsed} />

      {!collapsed && (
        <SidebarSections
          groupOpen={groupOpen}
          pinnedOpen={pinnedOpen}
          onToggleGroup={() => setGroupOpen((o) => !o)}
          onTogglePinned={() => setPinnedOpen((o) => !o)}
        />
      )}

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}
