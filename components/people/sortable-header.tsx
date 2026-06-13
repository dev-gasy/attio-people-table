import type { ComponentType } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

export type SortKey = "name" | "email" | "rating" | null;

export function SortableHeader({
  icon: Icon,
  label,
  sparkle,
  sortKey,
  activeSort,
  direction,
  onSort,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  sparkle?: boolean;
  sortKey?: Exclude<SortKey, null>;
  activeSort?: SortKey;
  direction?: "asc" | "desc";
  onSort?: (key: Exclude<SortKey, null>) => void;
}) {
  const isActive = sortKey && activeSort === sortKey;

  return (
    <button
      onClick={() => sortKey && onSort?.(sortKey)}
      disabled={!sortKey}
      className="flex w-full items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:cursor-default disabled:hover:text-muted-foreground"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {isActive &&
        (direction === "asc" ? (
          <ChevronUp className="h-3.5 w-3.5 text-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-foreground" />
        ))}
      {sparkle && <Sparkles className="ml-auto h-3.5 w-3.5 text-primary" />}
    </button>
  );
}

