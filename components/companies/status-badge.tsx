import {
  companyStatusStyles,
  type CompanyStatus,
} from "@/features/companies/company-mappers";

export function StatusBadge({ status }: { status: CompanyStatus }) {
  const s = companyStatusStyles[status];

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-muted/50 px-2.5 py-1 text-sm">
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      <span className={s.text}>{status}</span>
    </span>
  );
}
