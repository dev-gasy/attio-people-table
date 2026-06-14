"use client";

import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Rows3,
} from "lucide-react";

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [8, 16, 25, 50],
  className = "",
  bordered = true,
  padded = true,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  bordered?: boolean;
  padded?: boolean;
}) {
  const showPageSize = Boolean(onPageSizeChange);
  const paddingClass = padded ? "px-6 py-3" : "px-0 py-3";

  if (pageCount <= 1 && total <= pageSize && !showPageSize) {
    return (
      <div
        className={`flex items-center ${paddingClass} text-sm text-muted-foreground ${className}`}
      >
        {total} {total === 1 ? "record" : "records"}
      </div>
    );
  }

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageSizeChoices = Array.from(
    new Set([...pageSizeOptions, pageSize].filter((size) => size > 0)),
  ).sort((a, b) => a - b);

  // Build a compact page list with ellipsis
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 ${paddingClass} ${
        bordered ? "border-t border-border" : ""
      } ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-sm text-muted-foreground">
          {start}&ndash;{end} of {total}
        </span>
        {showPageSize && (
          <label className="inline-flex h-8 items-center overflow-hidden rounded-lg border border-border bg-background/80 text-sm shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
            <span className="relative h-full">
              <select
                value={pageSize}
                onChange={(event) =>
                  onPageSizeChange?.(Number(event.target.value))
                }
                className="h-full appearance-none bg-transparent pr-7 pl-2 text-sm font-medium text-foreground outline-none"
              >
                {pageSizeChoices.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </span>
          </label>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="First page"
        >
          <ChevronFirst className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`gap-${i}`}
              className="px-1 text-sm text-muted-foreground"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-sm ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(pageCount)}
          disabled={page === pageCount}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Last page"
        >
          <ChevronLast className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
