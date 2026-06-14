"use client";

import { useForm } from "@tanstack/react-form";
import { RotateCcw, Search } from "lucide-react";
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
    { name: "firstName", label: "First name", placeholder: "Avery" },
    { name: "lastName", label: "Last name", placeholder: "Johnson" },
    { name: "dateOfBirth", label: "Date of birth", type: "date" },
  ],
  [
    {
      name: "policyQuoteNumber",
      label: "Policy / quote number",
      placeholder: "POL-000123",
    },
  ],
  [
    { name: "email", label: "Email", placeholder: "name@example.com" },
    { name: "phone", label: "Phone", placeholder: "(555) 123-4567" },
    { name: "address", label: "Address", placeholder: "Street, city, state" },
  ],
];

function SearchField({
  form,
  searchField,
}: {
  form: ReturnType<typeof useForm<CustomerSearchValues>>;
  searchField: {
    name: keyof CustomerSearchValues;
    label: string;
    placeholder?: string;
    type?: string;
  };
}) {
  return (
    <form.Field
      name={searchField.name}
      children={(field) => (
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
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
          />
        </label>
      )}
    />
  );
}

export function CustomerSearchForm({
  onSearch,
  onReset,
}: {
  onSearch: (values: CustomerSearchValues) => void;
  onReset: () => void;
}) {
  const form = useForm({
    defaultValues: emptyCustomerSearchValues,
    onSubmit: ({ value }) => {
      onSearch(trimCustomerSearchValues(value));
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
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
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border bg-background/40 px-4 py-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onReset();
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
          <Button type="submit">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </Collapsible>
    </form>
  );
}
