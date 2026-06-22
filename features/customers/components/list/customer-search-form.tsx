import { revalidateLogic, useForm } from "@tanstack/react-form";
import { RotateCcw, Search } from "lucide-react";
import { useEffect, type ElementType, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible-section";
import {
  CustomerSearchSchema,
  emptyCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/domain/customers-list";
import {
  FormErrors,
  TextInputField,
  type StringFieldApi,
} from "@/components/ui/form-field";

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
  Field: ElementType;
};

function SearchField({
  form,
  searchField,
  disabled,
}: {
  form: CustomerFieldApi;
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
      children={(field: StringFieldApi): ReactNode => (
        <TextInputField
          field={field}
          label={searchField.label}
          type={searchField.type ?? "text"}
          placeholder={searchField.placeholder}
          disabled={disabled}
        />
      )}
    />
  );
}

export function CustomerSearchForm({
  values = emptyCustomerSearchValues,
  open,
  onOpenChange,
  onSearch,
  onReset,
  disabled = false,
}: {
  values?: CustomerSearchValues;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearch: (values: CustomerSearchValues) => void;
  onReset: () => void;
  disabled?: boolean;
}) {
  const form = useForm({
    defaultValues: values,
    validationLogic: revalidateLogic({
      mode: "blur",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: CustomerSearchSchema,
    },
    onSubmit: ({ value }) => {
      const parsedSearch = CustomerSearchSchema.safeParse(value);
      if (parsedSearch.success) onSearch(parsedSearch.data);
    },
  });

  useEffect(() => {
    form.reset(values);
  }, [form, values]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (disabled) return;
        form.handleSubmit();
      }}
    >
      <Collapsible
        title="Customer search"
        icon={Search}
        open={open}
        onOpenChange={onOpenChange}
      >
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

        <div className="border-t border-border bg-background/40 px-4 py-3">
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              errors: state.errors,
              submissionAttempts: state.submissionAttempts,
            })}
          >
            {(state) => (
              <>
                <FormErrors
                  errors={state.errors}
                  show={state.submissionAttempts > 0}
                  className="mb-3"
                />
                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={disabled || !state.canSubmit}>
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                  <Button
                    type="button"
                    disabled={disabled}
                    variant="outline"
                    onClick={onReset}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </>
            )}
          </form.Subscribe>
        </div>
      </Collapsible>
    </form>
  );
}
