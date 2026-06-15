import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  GROUPS_PAGE_SIZE,
  emptyGroupForm,
} from "@/features/groups/components/constants";
import type {
  GroupSortKey,
  GroupsView,
} from "@/features/groups/components/types";
import {
  createGroup,
  groupsQueryOptions,
} from "@/features/groups/group-service";
import {
  type Group,
  type GroupStatus,
  mapGroupDtosToGroups,
  mapGroupDtoToGroup,
} from "@/features/groups/group-mappers";
import { usePagination } from "@/hooks/use-pagination";

export function useGroupsPage() {
  const query = useQuery(groupsQueryOptions());
  const seedGroups = useMemo(
    () => mapGroupDtosToGroups(query.data ?? []),
    [query.data],
  );
  const [localGroups, setLocalGroups] = useState<Group[] | null>(null);
  const groups = localGroups ?? seedGroups;
  const [statusFilter, setStatusFilterState] = useState<GroupStatus>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [view, setView] = useState<GroupsView>("grid");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyGroupForm);
  const columnFilters = useMemo<ColumnFiltersState>(
    () => (statusFilter ? [{ id: "status", value: statusFilter }] : []),
    [statusFilter],
  );
  const tablePagination = useMemo(
    () => ({
      pageIndex: 0,
      pageSize: Math.max(1, groups.length),
    }),
    [groups.length],
  );
  const columns = useMemo<ColumnDef<Group>[]>(
    () => [
      { accessorKey: "name", id: "name" },
      { accessorKey: "domain", id: "domain" },
      {
        accessorKey: "status",
        id: "status",
        filterFn: (row, columnId, value) => row.getValue(columnId) === value,
      },
      { accessorKey: "employees", id: "employees" },
      { accessorKey: "arr", id: "arr" },
      { accessorKey: "location", id: "location" },
    ],
    [],
  );
  const table = useReactTable({
    data: groups,
    columns,
    state: {
      columnFilters,
      pagination: tablePagination,
      sorting,
    },
    getRowId: (row) => String(row.id),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const filteredRows = table.getRowModel().rows;
  const pagination = usePagination({
    items: filteredRows,
    initialPageSize: GROUPS_PAGE_SIZE,
  });
  const sortKey = (sorting[0]?.id as GroupSortKey | undefined) ?? null;
  const direction: "asc" | "desc" = sorting[0]?.desc ? "desc" : "asc";

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) return;

    setLocalGroups((prev) => [
      mapGroupDtoToGroup(createGroup(form, prev ?? seedGroups)),
      ...(prev ?? seedGroups),
    ]);
    setForm(emptyGroupForm);
    setAddOpen(false);
    pagination.resetPage();
  }

  function handleSort(key: GroupSortKey) {
    setSorting((prev) => {
      const current = prev[0];
      if (current?.id !== key) return [{ id: key, desc: false }];
      if (!current.desc) return [{ id: key, desc: true }];
      return [];
    });
    pagination.resetPage();
  }

  function setStatusFilter(status: GroupStatus | undefined) {
    setStatusFilterState(status);
    pagination.resetPage();
  }

  return {
    addOpen,
    direction,
    filteredTotal: filteredRows.length,
    form,
    handleAdd,
    handleSort,
    pageRows: pagination.pageItems,
    pagination,
    query,
    setAddOpen,
    setForm,
    setStatusFilter,
    setView,
    sortKey,
    statusFilter,
    view,
  };
}
