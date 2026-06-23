import type { ViewMode } from "@/lib/view-mode";

export type GroupsView = ViewMode;

export type GroupSortKey =
  | "organization"
  | "groupShortNameFr"
  | "groupShortNameEn"
  | "onlineIdentifier"
  | "province";
