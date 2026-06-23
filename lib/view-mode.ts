export type ViewMode = "grid" | "list";

export const DEFAULT_VIEW_MODE: ViewMode = "grid";

export function parseViewMode(value: unknown): ViewMode {
  return value === "grid" || value === "list" ? value : DEFAULT_VIEW_MODE;
}
