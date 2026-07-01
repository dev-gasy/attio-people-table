import { productFilterOptions } from "@/features/customers/components/detail/customer-detail-constants";
import type { CustomerProductActivityFilter } from "@/features/customers/domain/customer-detail";

type CustomerProductFilterProps = {
  value: CustomerProductActivityFilter;
  onChange: (value: CustomerProductActivityFilter) => void;
};

export function CustomerProductFilter({
  value,
  onChange,
}: CustomerProductFilterProps) {
  return (
    <div className="flex rounded-lg border border-border bg-muted/10 p-0.5">
      {productFilterOptions.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`h-7 rounded-md px-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
