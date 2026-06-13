import { DollarSign, Users } from "lucide-react";
import { Avatar } from "@/components/avatar";
import type { Company } from "@/features/companies/presentation";
import { StatusBadge } from "@/components/companies/status-badge";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <button className="flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4 text-left transition-colors hover:border-border hover:bg-muted/40">
      <div className="flex items-center gap-3">
        <Avatar initial={company.initial} color={company.color} size="md" />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-medium text-foreground">
            {company.name}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {company.domain}
          </div>
        </div>
      </div>
      <StatusBadge status={company.status} />
      <div className="flex items-center justify-between border-t border-border/60 pt-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {company.employees.toLocaleString()}
        </span>
        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
          <DollarSign className="h-3.5 w-3.5" />
          {company.arr}
        </span>
      </div>
    </button>
  );
}
