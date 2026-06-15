import type { ComponentType } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

export type TableSortDirection = "asc" | "desc";

export function SortableTableHeader<SortKey extends string>({
  icon: Icon,
  label,
  sparkle,
  sortKey,
  activeSort,
  direction,
  onSort,
  className = "",
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  sparkle?: boolean;
  sortKey?: SortKey;
  activeSort?: SortKey | null;
  direction?: TableSortDirection;
  onSort?: (key: SortKey) => void;
  className?: string;
}) {
  const isSortable = Boolean(sortKey && onSort);
  const isActive = Boolean(sortKey && activeSort === sortKey);
  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 max-w-full truncate">{label}</span>
      {isActive &&
        (direction === "asc" ? (
          <ChevronUp className="h-3.5 w-3.5 shrink-0 text-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-foreground" />
        ))}
      {sparkle && <Sparkles className="ml-auto h-3.5 w-3.5 text-primary" />}
    </>
  );
  const baseClassName = `flex w-full min-w-0 max-w-full items-center gap-2 text-sm font-medium text-muted-foreground ${className}`;

  if (!isSortable || !sortKey || !onSort) {
    return <div className={baseClassName}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`${baseClassName} hover:text-foreground`}
      aria-sort={
        isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
    >
      {content}
    </button>
  );
}
