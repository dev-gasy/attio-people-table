import { useState } from "react";

import { CustomerSearchForm } from "@/features/customers/components/list/customer-search-form";
import type { CustomerSearchValues } from "@/features/customers/domain/customers-list";

type CustomerSearchFilterProps = {
  disabled?: boolean;
  onReset: () => void;
  onSearch: (values: CustomerSearchValues) => Promise<boolean>;
  values: CustomerSearchValues;
};

export function CustomerSearchFilter({
  disabled = false,
  onReset,
  onSearch,
  values,
}: CustomerSearchFilterProps) {
  const [open, setOpen] = useState(true);

  return (
    <CustomerSearchForm
      values={values}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      onSearch={async (nextValues) => {
        const loaded = await onSearch(nextValues);
        if (loaded) setOpen(false);
      }}
      onReset={() => {
        setOpen(true);
        onReset();
      }}
    />
  );
}
