"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { LayoutGrid, List, Plus, Filter } from "lucide-react";
import { AddCompanyModal } from "@/components/companies/add-company-modal";
import { CompanyCard } from "@/components/companies/company-card";
import { CompanyRow } from "@/components/companies/company-row";
import {
  COMPANIES_PAGE_SIZE,
  companyColors,
  emptyCompanyForm,
  statusList,
  statusOptions,
} from "@/components/companies/constants";
import { PageHeader } from "@/components/page-header";
import { companies as seedCompanies, type Company } from "@/lib/companies-data";
import { Collapsible } from "@/components/ui/collapsible-section";
import { Combobox } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";

export type CompaniesPageSearch = {
  status?: Company["status"];
  view: "grid" | "list";
  page: number;
};

export function CompaniesPage() {
  const { data: initialCompanies = seedCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => seedCompanies,
    initialData: seedCompanies,
    staleTime: Infinity,
  });
  const [list, setList] = useState<Company[]>(initialCompanies);
  const [statusFilter, setStatusFilter] = useState<Company["status"]>();
  const [view, setView] = useState<CompaniesPageSearch["view"]>("grid");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyCompanyForm);

  const columns = useMemo<ColumnDef<Company>[]>(
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
    data: list,
    columns,
    state: {
      columnFilters: statusFilter
        ? [{ id: "status", value: statusFilter }]
        : [],
      pagination: {
        pageIndex: 0,
        pageSize: list.length,
      },
    },
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredRows = table.getRowModel().rows;
  const filteredTotal = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(filteredTotal / COMPANIES_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const gridRows = filteredRows.slice(
    (currentPage - 1) * COMPANIES_PAGE_SIZE,
    currentPage * COMPANIES_PAGE_SIZE,
  );

  const grouped = useMemo(
    () =>
      statusList
        .map((status) => ({
          status,
          items: filteredRows
            .map((row) => row.original)
            .filter((c) => c.status === status),
        }))
        .filter((g) => g.items.length > 0),
    [filteredRows],
  );

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const id = Math.max(0, ...list.map((c) => c.id)) + 1;
    setList((prev) => [
      {
        id,
        name: form.name.trim(),
        initial: form.name.trim()[0]?.toUpperCase() ?? "?",
        color: companyColors[id % companyColors.length],
        domain: form.domain.trim() || "example.com",
        employees: Number(form.employees) || 0,
        arr: form.arr.trim() || "$0",
        status: form.status,
        location: form.location.trim() || "Remote",
      },
      ...prev,
    ]);
    setForm(emptyCompanyForm);
    setAddOpen(false);
    setPage(1);
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Companies"
        actions={
          <>
            <Combobox
              icon={Filter}
              options={statusOptions}
              value={statusFilter as string | null}
              onChange={(v) => {
                setStatusFilter((v as Company["status"] | null) ?? undefined);
                setPage(1);
              }}
              placeholder="All statuses"
              searchPlaceholder="Filter status..."
              className="w-44"
            />
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
              <button
                onClick={() => setView("grid")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm ${
                  view === "grid"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm ${
                  view === "list"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </>
        }
      />

      <div className="flex-1 overflow-auto px-6 pb-8">
        {filteredTotal === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No companies match your filters
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridRows.map((row) => (
              <CompanyCard key={row.id} company={row.original} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {grouped.map((group) => (
              <Collapsible
                key={group.status}
                title={group.status}
                count={group.items.length}
              >
                {group.items.map((company) => (
                  <CompanyRow key={company.id} company={company} />
                ))}
              </Collapsible>
            ))}
          </div>
        )}
      </div>

      {view === "grid" && filteredTotal > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filteredTotal}
          pageSize={COMPANIES_PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      <AddCompanyModal
        open={addOpen}
        form={form}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        onFormChange={setForm}
      />
    </div>
  );
}
