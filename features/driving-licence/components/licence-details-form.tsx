import { useId, useState } from "react";
import { ChevronRight, IdCard, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { canadianProvinces } from "@/features/driving-licence/domain/provinces";
import type {
  Gender,
  LicenceForm,
} from "@/features/driving-licence/domain/licence";

const genderOptions: Gender[] = ["Male", "Female"];

export function LicenceDetailsForm({
  form,
  onFieldChange,
  onRandomize,
  onReset,
}: {
  form: LicenceForm;
  onFieldChange: (values: Partial<LicenceForm>) => void;
  onRandomize: () => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(true);
  const contentId = useId();

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
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
            <TextField
              autoFocus
              label="First Name"
              value={form.firstName}
              placeholder="Enter first name"
              onChange={(firstName) => onFieldChange({ firstName })}
            />
            <TextField
              label="Last Name"
              value={form.lastName}
              placeholder="Enter last name"
              onChange={(lastName) => onFieldChange({ lastName })}
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              placeholder="yyyy-mm-dd"
              onChange={(dateOfBirth) => onFieldChange({ dateOfBirth })}
            />

            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Province
              </span>
              <select
                required
                value={form.province}
                onChange={(event) =>
                  onFieldChange({ province: event.target.value })
                }
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20"
              >
                <option value="">Select province</option>
                {canadianProvinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </label>

            <GenderFieldset
              value={form.gender}
              onChange={(gender) => onFieldChange({ gender })}
            />

            <TextField
              label="Email"
              type="email"
              value={form.email}
              placeholder="name@example.com"
              onChange={(email) => onFieldChange({ email })}
            />
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

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input
        autoFocus={autoFocus}
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function GenderFieldset({
  value,
  onChange,
}: {
  value: Gender;
  onChange: (value: Gender) => void;
}) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-1.5">
      <legend className="text-xs font-medium text-muted-foreground">
        Gender
      </legend>
      <div className="grid grid-cols-2 gap-2 pt-2">
        {genderOptions.map((option) => {
          const id = `gender-${option.toLowerCase()}`;
          const isSelected = value === option;
          return (
            <label
              key={option}
              htmlFor={id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-2.5 py-2 text-sm transition-colors ${
                isSelected
                  ? "border-blue-400 text-blue-900 dark:border-blue-500 dark:text-blue-100"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-500"
                    : "border-muted-foreground"
                }`}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <input
                required
                type="radio"
                id={id}
                name="gender"
                value={option}
                checked={isSelected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
