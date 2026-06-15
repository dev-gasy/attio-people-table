import { useMemo, useState } from "react";

export type PaginationState<TItem> = {
  currentPage: number;
  page: number;
  pageCount: number;
  pageItems: TItem[];
  pageSize: number;
  resetPage: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  total: number;
};

export function usePagination<TItem>({
  items,
  initialPageSize,
}: {
  items: TItem[];
  initialPageSize: number;
}): PaginationState<TItem> {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, items, pageSize],
  );

  function setPageSize(nextPageSize: number) {
    setPageSizeState(nextPageSize);
    setPage(1);
  }

  return {
    currentPage,
    page,
    pageCount,
    pageItems,
    pageSize,
    resetPage: () => setPage(1),
    setPage,
    setPageSize,
    total,
  };
}
