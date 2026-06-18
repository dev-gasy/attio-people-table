import { useId, useState, type ElementType, type ReactNode } from "react";
import {
  CalendarDays,
  ChevronRight,
  IdCard,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react";
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

export function LicenceDetailsForm({ form }: { form: LicenceDetailsFormApi }) {
  const [open, setOpen] = useState(true);
  const contentId = useId();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="overflow-hidden rounded-lg border border-border bg-background"
    >
      <button
        type="button"
        aria-controls={contentId}
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="flex w-full items-center gap-2.5 border-b border-border bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/35"
      >
        <IdCard className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-foreground">Licence details</h2>
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
                <MapPin className="h-3.5 w-3.5" />
                Canada only
              </div>
            </FieldGroup>

            <FieldGroup icon={Mail} title="Contact" className="sm:col-span-2">
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
            </FieldGroup>
          </div>
        </div>
      </div>
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
