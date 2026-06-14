"use client";

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
import { AddGroupModal } from "@/components/groups/add-group-modal";
import { GroupsContent } from "@/components/groups/groups-content";
import { GroupsToolbar } from "@/components/groups/groups-toolbar";
import {
  GROUPS_PAGE_SIZE,
  emptyGroupForm,
} from "@/components/groups/constants";
import type { GroupsView } from "@/components/groups/types";
import { PageHeader } from "@/components/page-header";
import {
  type Group,
  type GroupStatus,
  mapGroupDtosToGroups,
  mapGroupDtoToGroup,
} from "@/features/groups/group-mappers";
import {
  groupsQueryOptions,
  createGroup,
} from "@/features/groups/group-service";
import { Pagination } from "@/components/ui/pagination";

export type GroupsPageSearch = {
  status?: GroupStatus;
  view: GroupsView;
  page: number;
};

export function GroupsPage() {
  const { data: groupsData = [], isPending } = useQuery(groupsQueryOptions());
  const seedGroups = useMemo(
    () => mapGroupDtosToGroups(groupsData),
    [groupsData],
  );
  const [localGroups, setLocalGroups] = useState<Group[] | null>(null);
  const groups = localGroups ?? seedGroups;
  const [statusFilter, setStatusFilter] = useState<GroupStatus>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [view, setView] = useState<GroupsView>("grid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(GROUPS_PAGE_SIZE);
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

  const sortKey = (sorting[0]?.id as GroupSortKey | undefined) ?? null;
  const direction = sorting[0]?.desc ? "desc" : "asc";
  const filteredRows = table.getRowModel().rows;
  const filteredTotal = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(filteredTotal / pageSize));
  const currentPage = Math.min(page, pageCount);
  const gridRows = useMemo(
    () =>
      filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, filteredRows, pageSize],
  );
  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLocalGroups((prev) => [
      mapGroupDtoToGroup(createGroup(form, prev ?? seedGroups)),
      ...(prev ?? seedGroups),
    ]);
    setForm(emptyGroupForm);
    setAddOpen(false);
    setPage(1);
  }

  function handleSort(key: GroupSortKey) {
    setSorting((prev) => {
      const current = prev[0];
      if (current?.id !== key) {
        return [{ id: key, desc: false }];
      }
      if (!current.desc) {
        return [{ id: key, desc: true }];
      }
      return [];
    });
    setPage(1);
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Groups"
        actions={
          <GroupsToolbar
            statusFilter={statusFilter}
            view={view}
            onAdd={() => setAddOpen(true)}
            onStatusFilterChange={(status) => {
              setStatusFilter(status);
              setPage(1);
            }}
            onViewChange={setView}
          />
        }
      />

      <GroupsContent
        filteredTotal={filteredTotal}
        activeSort={sortKey}
        direction={direction}
        isLoading={isPending}
        onSort={handleSort}
        rows={gridRows}
        view={view}
      />

      {!isPending && filteredTotal > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filteredTotal}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}

      <AddGroupModal
        open={addOpen}
        form={form}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        onFormChange={setForm}
      />
    </div>
  );
}

export type GroupSortKey =
  | "name"
  | "domain"
  | "status"
  | "employees"
  | "arr"
  | "location";
