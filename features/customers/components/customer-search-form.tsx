import { useForm } from "@tanstack/react-form";
import { RotateCcw, Search } from "lucide-react";
import { useEffect, useState, type ElementType, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible-section";
import {
  emptyCustomerSearchValues,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/customer-domain/customers-list";
import { Input } from "@/components/ui/input";

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
  onValueChange,
}: {
  form: { Field: ElementType };
  searchField: {
    name: keyof CustomerSearchValues;
    label: string;
    placeholder?: string;
    type?: string;
  };
  disabled?: boolean;
  onValueChange: (name: keyof CustomerSearchValues, value: string) => void;
}) {
  return (
    <form.Field
      name={searchField.name}
      children={(field: CustomerFieldApi): ReactNode => (
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {searchField.label}
          </span>
          <Input
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => {
              const value = event.target.value;
              onValueChange(searchField.name, value);
              field.handleChange(value);
            }}
            type={searchField.type ?? "text"}
            placeholder={searchField.placeholder}
            disabled={disabled}
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
  const [searchError, setSearchError] = useState<string | null>(null);
  const [draftValues, setDraftValues] = useState<CustomerSearchValues>(values);
  const canSearch = hasCustomerSearchValue(draftValues);
  const form = useForm({
    defaultValues: values,
    onSubmit: ({ value }) => {
      const trimmedValues = trimCustomerSearchValues(value);

      if (!hasCustomerSearchValue(trimmedValues)) {
        setSearchError("Unable to search if fields are empty.");
        return;
      }

      setSearchError(null);
      onSearch(trimmedValues);
    },
  });

  useEffect(() => {
    form.reset(values);
    setDraftValues(values);
    setSearchError(null);
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
                    onValueChange={(name, value) => {
                      setSearchError(null);
                      setDraftValues((currentValues) => ({
                        ...currentValues,
                        [name]: value,
                      }));
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-border bg-background/40 px-4 py-3">
          {searchError && (
            <p role="alert" className="mb-3 text-sm text-destructive">
              {searchError}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={disabled || !canSearch}>
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button
              type="button"
              disabled={disabled}
              variant="outline"
              onClick={() => {
                setSearchError(null);
                onReset();
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </Collapsible>
    </form>
  );
}

function hasCustomerSearchValue(values: CustomerSearchValues) {
  return Object.values(trimCustomerSearchValues(values)).some(Boolean);
}
