"use client";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Zap,
  CheckSquare,
  FileText,
  Users,
  Building2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Plus,
  Table2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export type PageId = "activity" | "tasks" | "notes" | "people" | "companies";
export type PagePath = `/${PageId}`;

const navItems: {
  id: PageId;
  to: PagePath;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}[] = [
  { id: "activity", to: "/activity", icon: Zap, label: "Activity" },
  { id: "tasks", to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { id: "notes", to: "/notes", icon: FileText, label: "Notes" },
  { id: "people", to: "/people", icon: Users, label: "People" },
  { id: "companies", to: "/companies", icon: Building2, label: "Companies" },
];

function NavItem({
  icon: Icon,
  label,
  active,
  collapsed,
  to,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  to?: PagePath;
  onClick?: () => void;
}) {
  const className = `flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
    collapsed ? "justify-center" : ""
  } ${
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
  }`
  const content = (
    <>
      <Icon
        className={`h-[18px] w-[18px] shrink-0 ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} title={collapsed ? label : undefined} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={className}
    >
      {content}
    </button>
  );
}

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
      {/* Workspace header */}
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

      {/* Search */}
      <div className="px-3 py-3">
        {collapsed ? (
          <button
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border bg-background/40 text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2.5 rounded-lg border border-sidebar-border bg-background/40 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                ⌘
              </kbd>
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                K
              </kbd>
            </div>
          </div>
        )}
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5 px-3">
        {navItems.map((item) =>
          item.id === "companies" ? (
            <div key={item.id}>
              <NavItem
                icon={item.icon}
                label={item.label}
                active={activePage === item.id}
                collapsed={collapsed}
                to={item.to}
              />
              {!collapsed && (
                <NavItem
                  icon={MoreHorizontal}
                  label="More"
                  collapsed={collapsed}
                />
              )}
            </div>
          ) : (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activePage === item.id}
              collapsed={collapsed}
              to={item.to}
            />
          ),
        )}
      </nav>

      {!collapsed && (
        <>
          {/* Pinned views */}
          <div className="mt-6 px-3">
            <button
              onClick={() => setPinnedOpen((o) => !o)}
              className="flex w-full items-center gap-1.5 px-3 pb-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {pinnedOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              Pinned Views
            </button>
            {pinnedOpen && (
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
                  <span className="truncate text-xs text-muted-foreground">
                    Top PQLs
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Group title */}
          <div className="mt-6 px-3">
            <div className="flex items-center justify-between px-3 pb-2">
              <button
                onClick={() => setGroupOpen((o) => !o)}
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
            {groupOpen && (
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
            )}
          </div>
        </>
      )}

      {/* Trial footer */}
      <div className="mt-auto border-t border-sidebar-border px-4 py-3">
        {collapsed ? (
          <ThemeToggle collapsed />
        ) : (
          <div className="flex items-center gap-3">
            <div className="ml-auto w-32">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
