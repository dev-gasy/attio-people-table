import { type ElementType, type ReactNode } from "react";
import { CalendarDays, MapPin, UserRound } from "lucide-react";
import {
  RadioGroupField,
  SelectField,
  TextInputField,
  type StringFieldApi,
} from "@/components/ui/form-field";
import { Collapsible } from "@/components/ui/collapsible-section";
import { canadianProvinces } from "@/features/driving-licence/domain/provinces";
import type {
  Gender,
  LicenceFormValues,
} from "@/features/driving-licence/domain/licence";

const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const provinceOptions = canadianProvinces.map((province) => ({
  label: province,
  value: province,
}));

type LicenceDetailsFormApi = {
  Field: ElementType;
  handleSubmit: () => void;
};

export function LicenceDetailsForm({
  filledCount,
  form,
  totalFields,
}: {
  filledCount: number;
  form: LicenceDetailsFormApi;
  totalFields: number;
}) {
  const isComplete = filledCount === totalFields;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <Collapsible
        title="Licence details"
        subtitle={
          isComplete
            ? "All fields complete"
            : `${filledCount} / ${totalFields} fields filled`
        }
        countClassName={
          isComplete
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
            : undefined
        }
      >
        <div className="grid gap-5 p-4 sm:grid-cols-2">
          <FieldGroup icon={UserRound} title="Identity">
            <form.Field name="firstName">
              {(
                field: StringFieldApi<LicenceFormValues["firstName"]>,
              ): ReactNode => (
                <TextInputField
                  autoFocus
                  field={field}
                  label="First Name"
                  placeholder="Enter first name"
                />
              )}
            </form.Field>
            <form.Field name="lastName">
              {(
                field: StringFieldApi<LicenceFormValues["lastName"]>,
              ): ReactNode => (
                <TextInputField
                  field={field}
                  label="Last Name"
                  placeholder="Enter last name"
                />
              )}
            </form.Field>
            <form.Field name="gender">
              {(
                field: StringFieldApi<LicenceFormValues["gender"]>,
              ): ReactNode => (
                <RadioGroupField
                  field={field}
                  label="Gender"
                  options={genderOptions}
                  columns={3}
                />
              )}
            </form.Field>
          </FieldGroup>

          <FieldGroup icon={CalendarDays} title="Eligibility">
            <form.Field name="dateOfBirth">
              {(
                field: StringFieldApi<LicenceFormValues["dateOfBirth"]>,
              ): ReactNode => (
                <TextInputField
                  field={field}
                  label="Date of Birth"
                  placeholder="yyyy-mm-dd"
                  type="date"
                />
              )}
            </form.Field>
            <form.Field name="province">
              {(
                field: StringFieldApi<LicenceFormValues["province"]>,
              ): ReactNode => (
                <SelectField
                  field={field}
                  label="Province"
                  options={provinceOptions}
                  placeholder="Select province"
                />
              )}
            </form.Field>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Canada only
            </div>
          </FieldGroup>

        </div>
      </Collapsible>
    </form>
  );
}

function FieldGroup({
  children,
  className = "",
  icon: Icon,
  title,
}: {
  children: ReactNode;
  className?: string;
  icon: ElementType;
  title: string;
}) {
  return (
    <section className={`min-w-0 space-y-4 ${className}`}>
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">
          {title}
        </h3>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}
