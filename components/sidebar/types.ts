import type { ComponentType } from "react";

export type PageId =
  | "kraken"
  | "lookups"
  | "tasks"
  | "notes"
  | "groups"
  | "load"
  | "customers";
export type PagePath = `/${PageId}`;

export type SidebarNavItem = {
  id: PageId;
  to: PagePath;
  icon: ComponentType<{ className?: string }>;
  label: string;
};

export type SidebarNavSection = {
  label: string;
  items: SidebarNavItem[];
};
