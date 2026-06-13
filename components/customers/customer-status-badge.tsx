import {
  customerStatusStyles,
  type CustomerStatus,
} from "@/features/customers/presentation";

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const style = customerStatusStyles[status];

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted/20 px-2 py-1 text-xs font-medium ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
