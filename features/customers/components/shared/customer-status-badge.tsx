import {
  customerStatusStyles,
  type CustomerStatus,
} from "@/features/customers/data/customer-mappers";

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const style = customerStatusStyles[status];

  return (
    <span className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md bg-muted/50 px-2.5 py-1 text-sm">
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      <span className={style.text}>{status}</span>
    </span>
  );
}
