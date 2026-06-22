import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible-section";
import { CustomerProductFilter } from "@/features/customers/components/detail/customer-product-filter";
import { CustomerProductRows } from "@/features/customers/components/detail/customer-product-rows";
import {
  filterCustomerProductsByActivity,
  groupCustomerProductsByBusinessDimension,
  type CustomerProductActivityFilter,
} from "@/features/customers/domain/customer-detail";
import type { CustomerProduct } from "@/features/customers/services/customers.types";

export function CustomerProductsTab({
  products,
}: {
  products: CustomerProduct[];
}) {
  const [activityFilter, setActivityFilter] =
    useState<CustomerProductActivityFilter>("All");
  const filteredProducts = useMemo(
    () => filterCustomerProductsByActivity(products, activityFilter),
    [activityFilter, products],
  );
  const groupedProducts = useMemo(
    () => groupCustomerProductsByBusinessDimension(filteredProducts),
    [filteredProducts],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {filteredProducts.length} products
        </div>
        <CustomerProductFilter
          value={activityFilter}
          onChange={setActivityFilter}
        />
      </div>

      {groupedProducts.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-sm text-muted-foreground">
          No products match this filter
        </div>
      ) : (
        groupedProducts.map((group) => (
          <Collapsible
            key={group.dimension}
            title={group.dimension}
            count={group.products.length}
            icon={Package}
          >
            <CustomerProductRows products={group.products} />
          </Collapsible>
        ))
      )}
    </div>
  );
}
