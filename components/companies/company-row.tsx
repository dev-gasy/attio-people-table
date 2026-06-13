import { Avatar } from "@/components/avatar";
import type { Company } from "@/lib/companies-data";
import { StatusBadge } from "@/components/companies/status-badge";

export function CompanyRow({ company }: { company: Company }) {
  return (
    <button className="grid w-full grid-cols-[1.6fr_1.2fr_1fr_0.8fr_1fr] items-center border-b border-border/60 px-4 py-2.5 text-left last:border-b-0 hover:bg-muted/30">
      <span className="flex items-center gap-2.5">
        <Avatar initial={company.initial} color={company.color} />
        <span className="text-sm text-foreground">{company.name}</span>
        <span className="text-xs text-muted-foreground">{company.domain}</span>
      </span>
      <span>
        <StatusBadge status={company.status} />
      </span>
      <span className="text-sm text-foreground">
        {company.employees.toLocaleString()}
      </span>
      <span className="text-sm text-emerald-700 dark:text-emerald-300">
        {company.arr}
      </span>
      <span className="text-sm text-muted-foreground">{company.location}</span>
    </button>
  );
}

