"use client";

import type { Row } from "@tanstack/react-table";
import { CompanyCard } from "@/components/companies/company-card";
import { CompanyRow } from "@/components/companies/company-row";
import type { CompaniesView } from "@/components/companies/types";
import type { Company } from "@/features/companies/company-mappers";

export function CompaniesContent({
  filteredTotal,
  isLoading = false,
  rows,
  view,
}: {
  filteredTotal: number;
  isLoading?: boolean;
  rows: Row<Company>[];
  view: CompaniesView;
}) {
  return (
    <div className="flex-1 overflow-auto px-6 pb-8">
      {isLoading ? (
        <CompaniesLoadingContent view={view} />
      ) : filteredTotal === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No companies match your filters
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <CompanyCard key={row.id} company={row.original} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-muted/10">
          <div className="grid grid-cols-[minmax(180px,1.5fr)_minmax(140px,1.2fr)_120px_minmax(96px,0.7fr)_minmax(80px,0.6fr)_minmax(140px,1fr)] items-center gap-4 border-b border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span className="truncate">Company</span>
            <span className="truncate">Web address</span>
            <span className="truncate">Status</span>
            <span className="truncate">Employees</span>
            <span className="truncate">ARR</span>
            <span className="truncate">Location</span>
          </div>
          {rows.map((row) => (
            <CompanyRow key={row.id} company={row.original} />
          ))}
        </div>
      )}
    </div>
  );
}

function CompaniesLoadingContent({ view }: { view: CompaniesView }) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-muted/10 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, cellIndex) => (
                <div
                  key={cellIndex}
                  className="h-3 animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-muted/10">
      <div className="grid grid-cols-[minmax(180px,1.5fr)_minmax(140px,1.2fr)_120px_minmax(96px,0.7fr)_minmax(80px,0.6fr)_minmax(140px,1fr)] items-center gap-4 border-b border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground">
        <span className="truncate">Company</span>
        <span className="truncate">Web address</span>
        <span className="truncate">Status</span>
        <span className="truncate">Employees</span>
        <span className="truncate">ARR</span>
        <span className="truncate">Location</span>
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[minmax(180px,1.5fr)_minmax(140px,1.2fr)_120px_minmax(96px,0.7fr)_minmax(80px,0.6fr)_minmax(140px,1fr)] items-center gap-4 border-b border-border/60 px-4 py-3"
        >
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          <div className="h-3 w-14 animate-pulse rounded bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
