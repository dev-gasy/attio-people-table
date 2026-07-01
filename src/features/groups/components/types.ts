import type { ViewMode } from "@/shared/utils/view-mode";

export type GroupsView = ViewMode;

export type GroupSortKey =
  | "organization"
  | "groupShortNameFr"
  | "groupShortNameEn"
  | "onlineIdentifier"
  | "province";
