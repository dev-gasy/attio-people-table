"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  type Person,
  type Connection,
  mapPersonDtosToPeople,
  mapPersonDtoToPerson,
} from "@/features/people/person-mappers";
import {
  createPerson,
  peopleQueryOptions,
} from "@/features/people/person-service";
import { AddPersonModal } from "@/components/people/add-person-modal";
import {
  emptyPersonForm,
  PEOPLE_PAGE_SIZE,
} from "@/components/people/constants";
import { PeoplePageHeader } from "@/components/people/people-page-header";
import { PeopleTableGrid } from "@/components/people/people-table-grid";
import { PeopleToolbar } from "@/components/people/people-toolbar";
import type { SortKey } from "@/components/people/sortable-header";
import { Pagination } from "@/components/ui/pagination";

export type PeopleTableSearch = {
  connection?: Connection;
  sort?: "name" | "email" | "rating";
  dir: "asc" | "desc";
  page: number;
  selected?: string | number;
};

export function PeopleTable() {
  const { data: peopleData = [] } = useQuery(peopleQueryOptions());
  const seedPeople = useMemo(
    () => mapPersonDtosToPeople(peopleData),
    [peopleData],
  );
  const [localPeople, setLocalPeople] = useState<Person[] | null>(null);
  const people = localPeople ?? seedPeople;
  const [connectionFilter, setConnectionFilter] = useState<Connection>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PEOPLE_PAGE_SIZE);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyPersonForm);

  const selected = useMemo(
    () => new Set(Object.keys(rowSelection).filter((id) => rowSelection[id])),
    [rowSelection],
  );
  const sortKey =
    (sorting[0]?.id as Exclude<SortKey, null> | undefined) ?? null;
  const direction = sorting[0]?.desc ? "desc" : "asc";
  const columnFilters = useMemo<ColumnFiltersState>(
    () =>
      connectionFilter
        ? [{ id: "connection", value: connectionFilter }]
        : [],
    [connectionFilter],
  );
  const tablePagination = useMemo(
    () => ({
      pageIndex: 0,
      pageSize: Math.max(1, people.length),
    }),
    [people.length],
  );

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      { id: "select" },
      { accessorKey: "name", id: "name" },
      { accessorKey: "email", id: "email" },
      {
        accessorKey: "connection",
        id: "connection",
        filterFn: (row, columnId, value) => row.getValue(columnId) === value,
      },
      { accessorKey: "rating", id: "rating" },
    ],
    [],
  );

  const table = useReactTable({
    data: people,
    columns,
    state: {
      columnFilters,
      sorting,
      pagination: tablePagination,
      rowSelection,
    },
    getRowId: (row) => String(row.id),
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      setRowSelection((prev) => functionalUpdate(updater, prev));
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const tableRows = table.getRowModel().rows;
  const filteredTotal = tableRows.length;
  const pageCount = Math.max(1, Math.ceil(filteredTotal / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = useMemo(
    () =>
      tableRows.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [currentPage, pageSize, tableRows],
  );

  const allSelected = rows.length > 0 && rows.every((r) => r.getIsSelected());

  const toggleAll = useCallback(function toggleAll() {
    setRowSelection((prev) => {
      const next = { ...prev };
      rows.forEach((row) => {
        if (allSelected) {
          delete next[row.id];
        } else {
          next[row.id] = true;
        }
      });
      return next;
    });
  }, [allSelected, rows]);

  function deleteSelected() {
    setLocalPeople((prev) =>
      (prev ?? seedPeople).filter((person) => !selected.has(String(person.id))),
    );
    setRowSelection({});
    setPage(1);
  }

  function handleSort(key: Exclude<SortKey, null>) {
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

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLocalPeople((prev) => [
      mapPersonDtoToPerson(createPerson(form, prev ?? seedPeople)),
      ...(prev ?? seedPeople),
    ]);
    setForm(emptyPersonForm);
    setAddOpen(false);
    setPage(1);
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PeoplePageHeader
        selectedCount={selected.size}
        onDeleteSelected={deleteSelected}
      />
      <PeopleToolbar
        connectionFilter={connectionFilter}
        sortKey={sortKey}
        onAdd={() => setAddOpen(true)}
        onFilterConnection={(connection) => {
          setConnectionFilter(connection);
          setPage(1);
        }}
        onSort={handleSort}
      />
      <PeopleTableGrid
        rows={rows}
        allSelected={allSelected}
        activeSort={sortKey}
        direction={direction}
        onAdd={() => setAddOpen(true)}
        onSort={handleSort}
        onToggleAll={toggleAll}
      />

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

      <AddPersonModal
        open={addOpen}
        form={form}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        onFormChange={setForm}
      />
    </div>
  );
}
