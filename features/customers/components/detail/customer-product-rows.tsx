import { CustomerProductRow } from "@/features/customers/components/detail/customer-product-row";
import type { CustomerProduct } from "@/features/customers/services/customers.types";

export function CustomerProductRows({
  products,
}: {
  products: CustomerProduct[];
}) {
  return (
    <div>
      <div className="flex items-center gap-4 border-b border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground">
        <span className="w-20 shrink-0">Type</span>
        <span className="min-w-[180px] flex-1">Product</span>
        <span className="w-24 shrink-0">Activity</span>
        <span className="w-32 shrink-0">Status</span>
        <span className="w-32 shrink-0">Amount</span>
        <span className="w-32 shrink-0">Effective</span>
      </div>
      <div className="divide-y divide-border/60">
        {products.map((product) => (
          <CustomerProductRow key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
