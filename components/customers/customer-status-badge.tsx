import {
  customerStatusStyles,
  type CustomerStatus,
} from "@/features/customers/presentation";

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const style = customerStatusStyles[status];

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 text-xs font-medium ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
