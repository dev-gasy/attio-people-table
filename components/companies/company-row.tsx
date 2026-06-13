import { Avatar } from "@/components/avatar";
import type { Company } from "@/features/companies/presentation";
import { StatusBadge } from "@/components/companies/status-badge";

export function CompanyRow({ company }: { company: Company }) {
  return (
    <button
      type="button"
      className="grid w-full grid-cols-[minmax(180px,1.5fr)_minmax(140px,1.2fr)_120px_minmax(96px,0.7fr)_minmax(80px,0.6fr)_minmax(140px,1fr)] items-center gap-4 border-b border-border/60 px-4 py-2.5 text-left last:border-b-0 hover:bg-muted/30"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar initial={company.initial} color={company.color} />
        <span className="truncate text-sm text-foreground" title={company.name}>
          {company.name}
        </span>
      </span>
      <span
        className="truncate text-sm text-muted-foreground"
        title={company.domain}
      >
        {company.domain}
      </span>
      <span className="min-w-0 whitespace-nowrap">
        <StatusBadge status={company.status} />
      </span>
      <span className="truncate text-sm text-foreground">
        {company.employees.toLocaleString()}
      </span>
      <span className="truncate text-sm text-emerald-700 dark:text-emerald-300">
        {company.arr}
      </span>
      <span
        className="truncate text-sm text-muted-foreground"
        title={company.location}
      >
        {company.location}
      </span>
    </button>
  );
}
