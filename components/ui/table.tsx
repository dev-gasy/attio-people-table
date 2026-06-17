import type { ComponentType, CSSProperties, ReactNode } from "react";
import {
  flexRender,
  type Column,
  type Row,
  type Table as TanStackTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type TableSortDirection = "asc" | "desc";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    alwaysVisible?: boolean;
    cellClassName?: string;
    icon?: ComponentType<{ className?: string }>;
    label?: string;
    loadingWidths?: readonly string[];
    minWidth?: number;
    width?: string;
  }
}

export function SortableTableHeader<SortKey extends string>({
  icon: Icon,
  label,
  sparkle,
  sortKey,
  activeSort,
  direction,
  onSort,
  className,
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
  const baseClassName = cn(
    "flex w-full min-w-0 max-w-full items-center gap-2 text-sm font-medium text-muted-foreground",
    className,
  );

  if (!isSortable || !sortKey || !onSort) {
    return <div className={baseClassName}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(baseClassName, "hover:text-foreground")}
      aria-sort={
        isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
    >
      {content}
    </button>
  );
}

export function TanStackTableHeader<TData>({
  column,
  className,
}: {
  column: Column<TData>;
  className?: string;
}) {
  const Icon = column.columnDef.meta?.icon;
  const label =
    column.columnDef.meta?.label ??
    (typeof column.columnDef.header === "string"
      ? column.columnDef.header
      : "");
  const isSorted = column.getIsSorted();
  const isSortable = column.getCanSort();
  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="min-w-0 max-w-full truncate">{label}</span>
      {isSorted === "asc" && (
        <ChevronUp className="h-3.5 w-3.5 shrink-0 text-foreground" />
      )}
      {isSorted === "desc" && (
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-foreground" />
      )}
    </>
  );
  const baseClassName = cn(
    "flex w-full min-w-0 max-w-full items-center gap-2 text-sm font-medium text-muted-foreground",
    className,
  );

  if (!isSortable) {
    return <div className={baseClassName}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(baseClassName, "hover:text-foreground")}
      aria-sort={
        isSorted === "asc"
          ? "ascending"
          : isSorted === "desc"
            ? "descending"
            : "none"
      }
    >
      {content}
    </button>
  );
}

export function TanStackGridHeader<TData>({
  table,
}: {
  table: TanStackTable<TData>;
}) {
  const columns = table.getVisibleLeafColumns();

  return (
    <>
      {columns.map((column, index) => (
        <TableHeaderCell key={column.id} last={index === columns.length - 1}>
          <TanStackTableHeader column={column} />
        </TableHeaderCell>
      ))}
    </>
  );
}

export function TanStackGridRows<TData>({
  gridStyle,
  rows,
}: {
  gridStyle?: CSSProperties;
  rows: Row<TData>[];
}) {
  return (
    <>
      {rows.map((row) => {
        const cells = row.getVisibleCells();

        return (
          <div
            key={row.id}
            style={gridStyle}
            className="grid text-sm hover:bg-muted/30"
          >
            {cells.map((cell, index) => (
              <TableBodyCell
                key={cell.id}
                className={cell.column.columnDef.meta?.cellClassName}
                last={index === cells.length - 1}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableBodyCell>
            ))}
          </div>
        );
      })}
    </>
  );
}

export function TableHeaderCell({
  children,
  className,
  last,
}: {
  children: ReactNode;
  className?: string;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0 max-w-full px-4 py-3",
        !last && "border-r border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TableBodyCell({
  as = "div",
  children,
  className,
  last,
}: {
  as?: "div" | "span";
  children: ReactNode;
  className?: string;
  last?: boolean;
}) {
  const Component = as;

  return (
    <Component
      className={cn(
        "flex min-w-0 max-w-full items-center px-4 py-2.5",
        !last && "border-r border-border/60",
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function TableLoadingCell({
  className,
  last,
  widths,
}: {
  className?: string;
  last?: boolean;
  widths: readonly string[];
}) {
  return (
    <TableBodyCell className={cn("gap-2.5", className)} last={last}>
      {widths.map((width) => (
        <span
          key={width}
          className={cn(width, "block max-w-full animate-pulse bg-muted")}
        />
      ))}
    </TableBodyCell>
  );
}

export type TableLoadingColumn = {
  className?: string;
  key?: string;
  widths: readonly string[];
};

export function TableLoadingRows({
  columns,
  gridClassName,
  gridStyle,
  rowCount,
}: {
  columns: readonly TableLoadingColumn[];
  gridClassName?: string;
  gridStyle?: CSSProperties;
  rowCount: number;
}) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          style={gridStyle}
          className={cn("grid border-b border-border/60", gridClassName)}
        >
          {columns.map((column, columnIndex) => (
            <TableLoadingCell
              key={column.key ?? columnIndex}
              className={column.className}
              widths={column.widths}
              last={columnIndex === columns.length - 1}
            />
          ))}
        </div>
      ))}
    </>
  );
}
