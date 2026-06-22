import type { CustomerStatus } from "@/features/customers/services/customers.types";

const customerStatusStyles: Record<
  CustomerStatus,
  { dot: string; text: string }
> = {
  Active: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  Prospect: { dot: "bg-sky-500", text: "text-sky-700 dark:text-sky-300" },
  "At risk": {
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-300",
  },
  Inactive: { dot: "bg-zinc-500", text: "text-muted-foreground" },
  Error: { dot: "bg-red-500", text: "text-red-700 dark:text-red-300" },
};

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const style = customerStatusStyles[status] ?? customerStatusStyles.Error;

  return (
    <span className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md bg-muted/50 px-2.5 py-1 text-sm">
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      <span className={style.text}>{status}</span>
    </span>
  );
}
