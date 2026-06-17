import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState as TanStackPaginationState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { DEFAULT_TABLE_PAGE_SIZE } from "@/hooks/use-pagination";

export type TanStackClientPaginationState<TData> = {
  currentPage: number;
  page: number;
  pageCount: number;
  pageItems: Row<TData>[];
  pageSize: number;
  resetPage: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  total: number;
};

export function useTanStackClientTable<TData>({
  columnVisibility,
  columns,
  data,
  getRowId,
  initialPageSize = DEFAULT_TABLE_PAGE_SIZE,
  onColumnVisibilityChange,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  page,
  pageSize,
  sorting,
}: {
  columnVisibility?: VisibilityState;
  columns: ColumnDef<TData>[];
  data: TData[];
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  initialPageSize?: number;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortingChange?: OnChangeFn<SortingState>;
  page?: number;
  pageSize?: number;
  sorting?: SortingState;
}) {
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize);
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const activeSorting = sorting ?? internalSorting;
  const activePage = page ?? internalPage;
  const activePageSize = pageSize ?? internalPageSize;
  const total = data.length;
  const pageCount = Math.max(1, Math.ceil(total / activePageSize));
  const currentPage = clampPage(activePage, pageCount);
  const paginationState = useMemo<TanStackPaginationState>(
    () => ({
      pageIndex: currentPage - 1,
      pageSize: activePageSize,
    }),
    [activePageSize, currentPage],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      pagination: paginationState,
      sorting: activeSorting,
    },
    getRowId,
    onColumnVisibilityChange,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const sortedRows = table.getSortedRowModel().rows;
  const pageRows = table.getPaginationRowModel().rows;
  const sortedColumn = activeSorting[0];
  const sortKey = sortedColumn?.id ?? null;
  const direction = sortedColumn?.desc ? "desc" : "asc";

  function handleSort(columnId: string) {
    table.getColumn(columnId)?.toggleSorting();
  }

  function resetSort() {
    table.resetSorting();
  }

  function setPage(nextPage: number) {
    setPageValue(clampPage(nextPage, pageCount));
  }

  function resetPage() {
    setPageValue(1);
  }

  function setPageSize(nextPageSize: number) {
    setPageSizeValue(nextPageSize);
    setPageValue(1);
  }

  function handlePaginationChange(
    updater: Parameters<OnChangeFn<TanStackPaginationState>>[0],
  ) {
    const nextPagination =
      typeof updater === "function" ? updater(paginationState) : updater;

    if (nextPagination.pageSize !== activePageSize) {
      setPageSize(nextPagination.pageSize);
      return;
    }

    setPage(nextPagination.pageIndex + 1);
  }

  function handleSortingChange(
    updater: Parameters<OnChangeFn<SortingState>>[0],
  ) {
    const nextSorting =
      typeof updater === "function" ? updater(activeSorting) : updater;

    if (onSortingChange) {
      onSortingChange(nextSorting);
    } else {
      setInternalSorting(nextSorting);
    }

    resetPage();
  }

  function setPageValue(nextPage: number) {
    if (onPageChange) {
      onPageChange(nextPage);
      return;
    }

    setInternalPage(nextPage);
  }

  function setPageSizeValue(nextPageSize: number) {
    if (onPageSizeChange) {
      onPageSizeChange(nextPageSize);
      return;
    }

    setInternalPageSize(nextPageSize);
  }

  return {
    pageRows,
    pagination: {
      currentPage,
      page: activePage,
      pageCount,
      pageItems: pageRows,
      pageSize: activePageSize,
      resetPage,
      setPage,
      setPageSize,
      total,
    } satisfies TanStackClientPaginationState<TData>,
    sortedRows,
    sort: {
      direction,
      handleSort,
      resetSort,
      sortKey,
    },
    table,
    visibleColumns: table.getVisibleLeafColumns(),
  };
}

function clampPage(page: number, pageCount: number) {
  return Math.min(Math.max(1, page), pageCount);
}
