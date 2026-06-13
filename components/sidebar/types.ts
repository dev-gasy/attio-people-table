import type { ComponentType } from "react";

export type PageId = "activity" | "tasks" | "notes" | "people" | "companies";
export type PagePath = `/${PageId}`;

export type SidebarNavItem = {
  id: PageId;
  to: PagePath;
  icon: ComponentType<{ className?: string }>;
  label: string;
};
