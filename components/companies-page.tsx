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
import { AddCompanyModal } from "@/components/companies/add-company-modal";
import { CompaniesContent } from "@/components/companies/companies-content";
import { CompaniesToolbar } from "@/components/companies/companies-toolbar";
import {
  COMPANIES_PAGE_SIZE,
  emptyCompanyForm,
} from "@/components/companies/constants";
import type { CompaniesView } from "@/components/companies/types";
import { PageHeader } from "@/components/page-header";
import {
  type Company,
  type CompanyStatus,
  mapCompanyDtosToCompanies,
  mapCompanyDtoToCompany,
} from "@/features/companies/company-mappers";
import {
  companiesQueryOptions,
  createCompany,
} from "@/features/companies/company-service";
import { Pagination } from "@/components/ui/pagination";

export type CompaniesPageSearch = {
  status?: CompanyStatus;
  view: CompaniesView;
  page: number;
};

export function CompaniesPage() {
  const { data: companiesData = [], isPending } = useQuery(
    companiesQueryOptions(),
  );
  const seedCompanies = useMemo(
    () => mapCompanyDtosToCompanies(companiesData),
    [companiesData],
  );
  const [localCompanies, setLocalCompanies] = useState<Company[] | null>(null);
  const companies = localCompanies ?? seedCompanies;
  const [statusFilter, setStatusFilter] = useState<CompanyStatus>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [view, setView] = useState<CompaniesView>("grid");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(COMPANIES_PAGE_SIZE);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyCompanyForm);
  const columnFilters = useMemo<ColumnFiltersState>(
    () => (statusFilter ? [{ id: "status", value: statusFilter }] : []),
    [statusFilter],
  );
  const tablePagination = useMemo(
    () => ({
      pageIndex: 0,
      pageSize: Math.max(1, companies.length),
    }),
    [companies.length],
  );

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
    data: companies,
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

  const sortKey = (sorting[0]?.id as CompanySortKey | undefined) ?? null;
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
    setLocalCompanies((prev) => [
      mapCompanyDtoToCompany(createCompany(form, prev ?? seedCompanies)),
      ...(prev ?? seedCompanies),
    ]);
    setForm(emptyCompanyForm);
    setAddOpen(false);
    setPage(1);
  }

  function handleSort(key: CompanySortKey) {
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

export type CompanySortKey =
  | "name"
  | "domain"
  | "status"
  | "employees"
  | "arr"
  | "location";
