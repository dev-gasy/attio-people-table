"use client";

import type { Row } from "@tanstack/react-table";
import { CompanyCard } from "@/components/companies/company-card";
import { CompanyRow } from "@/components/companies/company-row";
import type { CompaniesView } from "@/components/companies/types";
import type {
  Company,
  CompanyStatus,
} from "@/features/companies/presentation";
import { Collapsible } from "@/components/ui/collapsible-section";

export type CompanyGroup = {
  status: CompanyStatus;
  items: Company[];
};

export function CompaniesContent({
  filteredTotal,
  grouped,
  rows,
  view,
}: {
  filteredTotal: number;
  grouped: CompanyGroup[];
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
  );
}
