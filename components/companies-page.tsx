"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { AddCompanyModal } from "@/components/companies/add-company-modal";
import {
  CompaniesContent,
  type CompanyGroup,
} from "@/components/companies/companies-content";
import { CompaniesToolbar } from "@/components/companies/companies-toolbar";
import {
  COMPANIES_PAGE_SIZE,
  emptyCompanyForm,
  statusList,
} from "@/components/companies/constants";
import type { CompaniesView } from "@/components/companies/types";
import { PageHeader } from "@/components/page-header";
import {
  type Company,
  type CompanyStatus,
  toCompaniesPresentation,
  toCompanyPresentation,
} from "@/features/companies/presentation";
import { createCompany, getCompanies } from "@/features/companies/service";
import { Pagination } from "@/components/ui/pagination";

export type CompaniesPageSearch = {
  status?: CompanyStatus;
  view: CompaniesView;
  page: number;
};

export function CompaniesPage() {
  const { data: initialCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    initialData: getCompanies,
    staleTime: Infinity,
  });
  const seedCompanies = useMemo(
    () => toCompaniesPresentation(initialCompanies),
    [initialCompanies],
  );
  const [list, setList] = useState<Company[]>(seedCompanies);
  const [statusFilter, setStatusFilter] = useState<CompanyStatus>();
  const [view, setView] = useState<CompaniesView>("grid");
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

  const grouped = useMemo<CompanyGroup[]>(
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
    setList((prev) => [
      toCompanyPresentation(createCompany(form, prev)),
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
          <CompaniesToolbar
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

      <CompaniesContent
        filteredTotal={filteredTotal}
        grouped={grouped}
        rows={gridRows}
        view={view}
      />

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
