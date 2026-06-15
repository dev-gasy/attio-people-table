import type { CustomerProduct } from "@/features/customers/customer-mappers";

export function CustomerProductRow({ product }: { product: CustomerProduct }) {
  return (
    <div className="flex min-h-12 items-center gap-4 px-4 py-2.5 text-sm">
      <span className={`w-20 shrink-0 font-medium`}>{product.type}</span>
      <span className="min-w-[180px] flex-1 truncate text-foreground">
        {product.name}
      </span>
      <span
        className={`w-24 shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${
          product.activity === "Active"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : "border-border bg-muted/20 text-muted-foreground"
        }`}
      >
        {product.activity}
      </span>
      <span className="w-32 shrink-0 truncate text-muted-foreground">
        {product.status}
      </span>
      <span className="w-32 shrink-0 truncate text-foreground">
        {product.amount}
      </span>
      <span className="w-32 shrink-0 truncate text-muted-foreground">
        {product.effectiveDate}
      </span>
    </div>
  );
}
