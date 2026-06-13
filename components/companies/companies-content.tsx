"use client";

import type { Row } from "@tanstack/react-table";
import { CompanyCard } from "@/components/companies/company-card";
import { CompanyRow } from "@/components/companies/company-row";
import type { CompaniesView } from "@/components/companies/types";
import type { Company } from "@/features/companies/company-mappers";

export function CompaniesContent({
  filteredTotal,
  rows,
  view,
}: {
  filteredTotal: number;
  rows: Row<Company>[];
  view: CompaniesView;
}) {
  return (
    <div className="flex-1 overflow-auto px-6 pb-8">
      {filteredTotal === 0 ? (
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
