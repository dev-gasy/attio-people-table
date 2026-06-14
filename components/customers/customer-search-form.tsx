"use client";

import { useForm } from "@tanstack/react-form";
import { RotateCcw, Search } from "lucide-react";
import { useEffect, type ElementType, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible-section";
import {
  emptyCustomerSearchValues,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/customer-domain/customers-list";

const fieldGroups: Array<
  Array<{
    name: keyof CustomerSearchValues;
    label: string;
    placeholder?: string;
    type?: string;
  }>
> = [
  [
    {
      name: "firstName",
      label: "First name",
      placeholder: "Search by first name",
    },
    {
      name: "lastName",
      label: "Last name",
      placeholder: "Search by last name",
    },
    { name: "dateOfBirth", label: "Date of birth", type: "date" },
  ],
  [
    {
      name: "policyQuoteNumber",
      label: "Policy / quote number",
      placeholder: "Policy or quote ID",
    },
  ],
  [
    { name: "email", label: "Email", placeholder: "name@domain.com" },
    { name: "phone", label: "Phone", placeholder: "Phone number" },
    {
      name: "address",
      label: "Address",
      placeholder: "Street, city, state, or ZIP",
    },
  ],
];

type CustomerFieldApi = {
  name: keyof CustomerSearchValues;
  state: { value: string };
  handleBlur: () => void;
  handleChange: (value: string) => void;
};

function SearchField({
  form,
  searchField,
  disabled,
}: {
  form: { Field: ElementType };
  searchField: {
    name: keyof CustomerSearchValues;
    label: string;
    placeholder?: string;
    type?: string;
  };
  disabled?: boolean;
}) {
  return (
    <form.Field
      name={searchField.name}
      children={(field: CustomerFieldApi): ReactNode => (
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {searchField.label}
          </span>
          <input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
            type={searchField.type ?? "text"}
            placeholder={searchField.placeholder}
            disabled={disabled}
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
      )}
    />
  );
}

export function CustomerSearchForm({
  values = emptyCustomerSearchValues,
  onSearch,
  onReset,
  disabled = false,
}: {
  values?: CustomerSearchValues;
  onSearch: (values: CustomerSearchValues) => void;
  onReset: () => void;
  disabled?: boolean;
}) {
  const form = useForm({
    defaultValues: values,
    onSubmit: ({ value }) => {
      onSearch(trimCustomerSearchValues(value));
    },
  });

  useEffect(() => {
    form.reset(values);
  }, [values]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (disabled) return;
        form.handleSubmit();
      }}
    >
      <Collapsible title="Customer search" icon={Search}>
        <div className="divide-y divide-border/60 bg-muted/10">
          {fieldGroups.map((group, index) => (
            <section key={index} className="px-4 py-4">
              <div className="grid gap-3 md:grid-cols-3">
                {group.map((searchField) => (
                  <SearchField
                    key={searchField.name}
                    form={form}
                    searchField={searchField}
                    disabled={disabled}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border bg-background/40 px-4 py-3">
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            onClick={() => {
              form.reset();
              onReset();
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
          <Button type="submit" disabled={disabled}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </Collapsible>
    </form>
  );
}
