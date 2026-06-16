import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type {
  GroupSortKey,
  GroupsView,
} from "@/features/groups/components/types";
import { groupsQueryOptions } from "@/features/groups/group-service";
import type { Group } from "@/features/groups/group-mappers";
import { usePagination } from "@/hooks/use-pagination";

export type GroupsSearch = {
  province?: string;
  search?: string;
};

export function shouldFetchGroups(filters: GroupsSearch | undefined) {
  return Boolean(filters?.province || hasSearchQuery(filters?.search));
}

export function hasSearchQuery(search: string | undefined) {
  return Boolean(search && search.trim().length >= 3);
}

export function useGroupsPage(filters: GroupsSearch = {}) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [view, setView] = useState<GroupsView>("grid");
  const [draftSearch, setDraftSearch] = useState(filters.search ?? "");
  const shouldLoadGroups = shouldFetchGroups(filters);
  const query = useQuery({
    ...groupsQueryOptions(filters),
    enabled: shouldLoadGroups,
  });
  const groups = useMemo(() => query.data ?? [], [query.data]);
  const columns = useMemo<ColumnDef<Group>[]>(
    () => [
      { accessorKey: "organization", id: "organization" },
      { accessorKey: "groupShortNameFr", id: "groupShortNameFr" },
      { accessorKey: "groupShortNameEn", id: "groupShortNameEn" },
      { accessorKey: "onlineIdentifier", id: "onlineIdentifier" },
      { accessorKey: "province", id: "province" },
    ],
    [],
  );
  const table = useReactTable({
    data: groups,
    columns,
    state: { sorting },
    getRowId: (row) => String(row.id),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const sortedRows = table.getRowModel().rows;
  const pagination = usePagination({
    items: sortedRows,
  });
  const sortKey = (sorting[0]?.id as GroupSortKey | undefined) ?? null;
  const direction: "asc" | "desc" = sorting[0]?.desc ? "desc" : "asc";

  useEffect(() => {
    if (filters.search !== undefined) {
      setDraftSearch(filters.search);
    }
  }, [filters.search]);

  function handleSort(key: GroupSortKey) {
    setSorting((prev) => {
      const current = prev[0];
      if (current?.id !== key) return [{ id: key, desc: false }];
      if (!current.desc) return [{ id: key, desc: true }];
      return [];
    });
    pagination.resetPage();
  }

  function setProvince(province: string | null) {
    pagination.resetPage();
    void navigate({
      to: "/groups",
      search: {
        province: province ?? undefined,
        search: filters.search,
      },
    });
  }

  function setSearch(value: string) {
    const trimmedValue = value.trim();

    setDraftSearch(value);
    pagination.resetPage();
    void navigate({
      to: "/groups",
      search: {
        province: filters.province,
        search: trimmedValue.length >= 3 ? value : undefined,
      },
    });
  }

  return {
    direction,
    draftSearch,
    filteredTotal: sortedRows.length,
    handleSort,
    pageRows: pagination.pageItems,
    pagination,
    query,
    setProvince,
    setSearch,
    setView,
    shouldLoadGroups,
    sortKey,
    view,
  };
}
