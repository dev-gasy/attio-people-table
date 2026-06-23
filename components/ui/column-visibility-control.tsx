import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw, Settings2 } from "lucide-react";

export type ColumnVisibilityOption<T extends string> = {
  id: T;
  label: string;
  alwaysVisible?: boolean;
};

type ColumnVisibilityControlProps<T extends string> = {
  columns: ColumnVisibilityOption<T>[];
  visibleColumns: Set<T>;
  onToggle: (column: T) => void;
  onReset: () => void;
};

export function ColumnVisibilityControl<T extends string>({
  columns,
  visibleColumns,
  onToggle,
  onReset,
}: ColumnVisibilityControlProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Column visibility"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-muted"
      >
        <Settings2 className="h-4 w-4 text-muted-foreground" />
        View
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
          <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
            Column visibility
          </div>
          <div className="p-1">
            {columns.map((column) => {
              const checked =
                column.alwaysVisible || visibleColumns.has(column.id);

              return (
                <button
                  key={column.id}
                  type="button"
                  disabled={column.alwaysVisible}
                  onClick={() => onToggle(column.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-foreground hover:bg-muted disabled:cursor-default disabled:hover:bg-transparent"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      column.alwaysVisible
                        ? "border-border bg-muted text-muted-foreground"
                        : checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {column.label}
                  </span>
                  {column.alwaysVisible && (
                    <span className="text-xs text-muted-foreground">
                      Always shown
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-t border-border p-1">
            <button
              type="button"
              onClick={onReset}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset columns
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
