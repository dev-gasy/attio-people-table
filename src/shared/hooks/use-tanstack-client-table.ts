import { useMemo, useState, type CSSProperties } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { DEFAULT_TABLE_PAGE_SIZE } from "@/shared/hooks/use-pagination";

export type TanStackClientPaginationState<TData> = {
  currentPage: number;
  pageCount: number;
  pageItems: Row<TData>[];
  pageSize: number;
  resetPage: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  total: number;
};

interface UseTanStackClientTableOptions<TData> {
  columnVisibility?: VisibilityState;
  columns: ColumnDef<TData>[];
  data: TData[];
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  initialPageSize?: number;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
}

export function useTanStackClientTable<TData>({
  columnVisibility,
  columns,
  data,
  getRowId,
  initialPageSize = DEFAULT_TABLE_PAGE_SIZE,
  onColumnVisibilityChange,
}: UseTanStackClientTableOptions<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    autoResetPageIndex: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: initialPageSize },
    },
    state: {
      columnVisibility,
      sorting,
    },
    getRowId,
    onColumnVisibilityChange,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const currentPage = pageIndex + 1;
  const pageItems = table.getPaginationRowModel().rows;
  const sortedRows = table.getSortedRowModel().rows;
  const sortedColumn = sorting[0];
  const visibleColumns = table.getVisibleLeafColumns();
  const tableGridStyle = useMemo(
    () =>
      ({
        gridTemplateColumns: visibleColumns
          .map((column) => column.columnDef.meta?.width ?? "minmax(0, 1fr)")
          .join(" "),
      }) satisfies CSSProperties,
    [visibleColumns],
  );
  const tableMinWidth = useMemo(
    () =>
      visibleColumns.reduce(
        (total, column) => total + (column.columnDef.meta?.minWidth ?? 0),
        0,
      ),
    [visibleColumns],
  );

  return {
    pageRows: pageItems,
    pageItems,
    pagination: {
      currentPage,
      pageCount,
      pageItems,
      pageSize,
      resetPage: () => table.resetPageIndex(),
      setPage: (page: number) => table.setPageIndex(page - 1),
      setPageSize: (size: number) => table.setPageSize(size),
      total: data.length,
    } satisfies TanStackClientPaginationState<TData>,
    sort: {
      direction: sortedColumn?.desc ? "desc" : ("asc" as const),
      handleSort: (columnId: string) => {
        table.getColumn(columnId)?.toggleSorting();
      },
      resetSort: () => table.resetSorting(),
      sortKey: sortedColumn?.id ?? null,
    },
    sortedRows,
    table,
    tableGridStyle,
    tableMinWidth,
    visibleColumns,
  };
}
