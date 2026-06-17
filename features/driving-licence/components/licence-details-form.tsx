import { useId, useState, type ElementType, type ReactNode } from "react";
import { ChevronRight, IdCard, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RadioGroupField,
  SelectField,
  TextInputField,
  type StringFieldApi,
} from "@/components/ui/form-field";
import { canadianProvinces } from "@/features/driving-licence/domain/provinces";
import type {
  Gender,
  LicenceFormValues,
} from "@/features/driving-licence/domain/licence";

const genderOptions: Array<{ label: Gender; value: Gender }> = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
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
  form,
  onRandomize,
  onReset,
}: {
  form: LicenceDetailsFormApi;
  onRandomize: () => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(true);
  const contentId = useId();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="overflow-hidden rounded-xl border border-border"
    >
      <button
        type="button"
        aria-controls={contentId}
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="flex w-full items-center gap-2.5 bg-muted/30 px-4 py-3 text-left hover:bg-muted/50"
      >
        <IdCard className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          Licence details
        </span>
        <ChevronRight
          className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      <div
        id={contentId}
        className={`grid transition-all duration-200 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-4 border-t border-border bg-muted/10 px-4 py-4 sm:grid-cols-2">
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
            <form.Field name="gender">
              {(
                field: StringFieldApi<LicenceFormValues["gender"]>,
              ): ReactNode => (
                <RadioGroupField
                  field={field}
                  label="Gender"
                  options={genderOptions}
                />
              )}
            </form.Field>
            <form.Field name="email">
              {(
                field: StringFieldApi<LicenceFormValues["email"]>,
              ): ReactNode => (
                <TextInputField
                  field={field}
                  label="Email"
                  placeholder="name@example.com"
                  type="email"
                />
              )}
            </form.Field>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border bg-background/40 px-4 py-3">
            <Button type="button" variant="outline" onClick={onRandomize}>
              <Shuffle className="h-4 w-4" />
              Randomize
            </Button>
            <Button type="button" variant="outline" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
