import { useMemo, useState } from "react";

export type VisibilityColumn<TColumnKey extends string> = {
  alwaysVisible?: boolean;
  id: TColumnKey;
};

export type ColumnVisibilityState<TColumnKey extends string> = {
  columnVisibility: Record<TColumnKey, boolean>;
  resetColumnVisibility: () => void;
  toggleColumn: (column: TColumnKey) => void;
  visibleColumnIds: Set<TColumnKey>;
};

export function useColumnVisibility<TColumnKey extends string>({
  columns,
  defaultVisibility,
  onHideSortedColumn,
}: {
  columns: Array<VisibilityColumn<TColumnKey>>;
  defaultVisibility: Record<TColumnKey, boolean>;
  onHideSortedColumn?: (column: TColumnKey) => void;
}): ColumnVisibilityState<TColumnKey> {
  const [columnVisibility, setColumnVisibility] = useState(defaultVisibility);
  const visibleColumnIds = useMemo(
    () =>
      new Set(
        columns
          .filter(
            (column) =>
              column.alwaysVisible || columnVisibility[column.id] === true,
          )
          .map((column) => column.id),
      ),
    [columnVisibility, columns],
  );

  function toggleColumn(column: TColumnKey) {
    const columnConfig = columns.find((item) => item.id === column);
    if (columnConfig?.alwaysVisible) return;

    setColumnVisibility((visibility) => ({
      ...visibility,
      [column]: !visibility[column],
    }));
    onHideSortedColumn?.(column);
  }

  return {
    columnVisibility,
    resetColumnVisibility: () => setColumnVisibility(defaultVisibility),
    toggleColumn,
    visibleColumnIds,
  };
}
