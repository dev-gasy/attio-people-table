"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  Info,
  Table2,
  ChevronDown,
  ListFilter,
  ArrowUpDown,
  Settings,
  User,
  AtSign,
  Zap,
  Star,
  Plus,
  Trash2,
} from "lucide-react";
import {
  people as seedPeople,
  type Person,
  type Connection,
} from "@/lib/people-data";
import { AddPersonModal } from "@/components/people/add-person-modal";
import {
  avatarColors,
  connectionOptions,
  emptyPersonForm,
  PEOPLE_PAGE_SIZE,
} from "@/components/people/constants";
import { PeopleTableRow } from "@/components/people/people-table-row";
import {
  SortableHeader,
  type SortKey,
} from "@/components/people/sortable-header";
import { Combobox } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";

export type PeopleTableSearch = {
  connection?: Connection;
  sort?: "name" | "email" | "rating";
  dir: "asc" | "desc";
  page: number;
  selected?: string | number;
};

export function PeopleTable() {
  const { data: initialPeople = seedPeople } = useQuery({
    queryKey: ["people"],
    queryFn: async () => seedPeople,
    initialData: seedPeople,
    staleTime: Infinity,
  });
  const [list, setList] = useState<Person[]>(initialPeople);
  const [connectionFilter, setConnectionFilter] = useState<Connection>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
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
    data: list,
    columns,
    state: {
      columnFilters: connectionFilter
        ? [{ id: "connection", value: connectionFilter }]
        : [],
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: list.length,
      },
      rowSelection,
    },
    getRowId: (row) => String(row.id),
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const next = functionalUpdate(updater, rowSelection);
      setRowSelection(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const tableRows = table.getRowModel().rows;
  const filteredTotal = tableRows.length;
  const pageCount = Math.max(1, Math.ceil(filteredTotal / PEOPLE_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = tableRows.slice(
    (currentPage - 1) * PEOPLE_PAGE_SIZE,
    currentPage * PEOPLE_PAGE_SIZE,
  );

  const allSelected = rows.length > 0 && rows.every((r) => r.getIsSelected());

  function toggleAll() {
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
  }

  function deleteSelected() {
    setList((prev) => prev.filter((p) => !selected.has(String(p.id))));
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
    const id = Math.max(0, ...list.map((p) => p.id)) + 1;
    setList((prev) => [
      {
        id,
        name: form.name.trim(),
        initial: form.name.trim()[0]?.toUpperCase() ?? "?",
        avatarColor: avatarColors[id % avatarColors.length],
        email: form.email.trim() || "unknown@attio.com",
        connection: form.connection,
        connectionWith: form.connectionWith.trim() || "Team",
        rating: form.rating,
      },
      ...prev,
    ]);
    setForm(emptyPersonForm);
    setAddOpen(false);
    setPage(1);
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header className="flex items-center gap-2 px-6 pt-5 pb-4">
        <h1 className="text-2xl font-semibold text-foreground">People</h1>
        <Info className="h-4 w-4 text-muted-foreground" />
        {selected.size > 0 && (
          <div className="ml-2 flex items-center gap-2">
            <span className="rounded-md bg-primary/15 px-2.5 py-1 text-sm text-primary">
              {selected.size} selected
            </span>
            <button
              onClick={deleteSelected}
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-sm text-rose-700 hover:bg-muted dark:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-wrap items-center gap-2 px-6 pb-4">
        <button className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-muted">
          <Table2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Activity
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <Combobox
          icon={ListFilter}
          options={connectionOptions}
          value={connectionFilter as Connection | null}
          onChange={(v) => {
            setConnectionFilter((v as Connection | null) ?? undefined);
            setPage(1);
          }}
          placeholder="Filter connection"
          searchPlaceholder="Filter by strength..."
          className="w-52"
        />
        <button
          onClick={() => handleSort("name")}
          className={`flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted ${
            sortKey ? "bg-muted text-foreground" : "bg-muted/40 text-foreground"
          }`}
        >
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          Sort
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground hover:bg-muted">
            <Settings className="h-4 w-4 text-muted-foreground" />
            View
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-285">
          <div className="sticky top-0 z-10 grid grid-cols-[40px_1fr_1fr_1.2fr_220px] border-y border-border bg-background">
            <div className="flex items-center justify-center border-r border-border px-2 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-4 w-4 cursor-pointer accent-blue-500"
                aria-label="Select all"
              />
            </div>
            <div className="border-r border-border px-4 py-3">
              <SortableHeader
                icon={User}
                label="Record"
                sortKey="name"
                activeSort={sortKey}
                direction={direction}
                onSort={handleSort}
              />
            </div>
            <div className="border-r border-border px-4 py-3">
              <SortableHeader
                icon={AtSign}
                label="Email address"
                sortKey="email"
                activeSort={sortKey}
                direction={direction}
                onSort={handleSort}
              />
            </div>
            <div className="border-r border-border px-4 py-3">
              <SortableHeader icon={Zap} label="Connection strength" sparkle />
            </div>
            <div className="px-4 py-3">
              <SortableHeader
                icon={Star}
                label="Work experience"
                sortKey="rating"
                activeSort={sortKey}
                direction={direction}
                onSort={handleSort}
              />
            </div>
          </div>

          {rows.map((row) => (
            <PeopleTableRow key={row.id} row={row} />
          ))}

          {rows.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No people match your filters
            </div>
          )}

          <div className="border-b border-border/60">
            <button
              onClick={() => setAddOpen(true)}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add Person
            </button>
          </div>
        </div>
      </div>

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filteredTotal}
        pageSize={PEOPLE_PAGE_SIZE}
        onPageChange={setPage}
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
