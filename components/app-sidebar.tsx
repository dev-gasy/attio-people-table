import { useState } from "react";
import { PrimaryNav } from "@/components/sidebar/primary-nav";
import { CommandSearch } from "@/components/sidebar/command-search";
import { SidebarFooter } from "@/components/sidebar/sidebar-footer";
import { SidebarSearch } from "@/components/sidebar/sidebar-search";
import { WorkspaceHeader } from "@/components/sidebar/workspace-header";
import type { PageId } from "@/components/sidebar/types";

export type { PageId, PagePath } from "@/components/sidebar/types";

type AppSidebarProps = {
  activePage: PageId;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function AppSidebar({
  activePage,
  collapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <aside
        className={`flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ${
          collapsed ? "w-17" : "w-72"
        }`}
      >
        <WorkspaceHeader
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
        />
        <SidebarSearch
          collapsed={collapsed}
          onOpen={() => setCommandOpen(true)}
        />
        <div className="min-h-0 flex-1 overflow-y-auto pb-3">
          <PrimaryNav activePage={activePage} collapsed={collapsed} />
        </div>
        <SidebarFooter collapsed={collapsed} />
      </aside>
      <CommandSearch
        open={commandOpen}
        collapsed={collapsed}
        onClose={() => setCommandOpen(false)}
        onOpen={() => setCommandOpen(true)}
        onToggleCollapse={onToggleCollapse}
      />
    </>
  );
}
