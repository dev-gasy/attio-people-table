import { useMemo, useState, type FormEvent } from "react";
import { BadgeCheck, IdCard, RotateCcw } from "lucide-react";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

type Gender = "Male" | "Female";

type LicenceForm = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  province: string;
  gender: Gender;
  email: string;
};

type LicenceResult = LicenceForm & {
  licenceNumber: string;
  generatedAt: string;
};

const emptyForm: LicenceForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  province: "",
  gender: "Male",
  email: "",
};

const canadianProvinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

export function DrivingLicencePage() {
  const [form, setForm] = useState<LicenceForm>(emptyForm);
  const [result, setResult] = useState<LicenceResult | null>(null);

  const canGenerate = useMemo(
    () =>
      Boolean(
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.dateOfBirth &&
        form.province &&
        form.gender &&
        form.email.trim(),
      ),
    [form],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canGenerate) return;

    setResult({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dateOfBirth: form.dateOfBirth,
      province: form.province,
      gender: form.gender,
      email: form.email.trim(),
      licenceNumber: generateLicenceNumber(form),
      generatedAt: new Date().toLocaleDateString("en-CA"),
    });
  }

  function handleReset() {
    setForm(emptyForm);
    setResult(null);
  }

  return (
    <PageFrame>
      <PageHeader title="Driving Licence" />

      <PageFrameBody className="pb-8">
        <div className="flex flex-col gap-6">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-xl border border-border"
          >
            <div className="flex items-center gap-2.5 bg-muted/30 px-4 py-3">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Licence details
              </span>
            </div>

            <div className="grid gap-4 bg-muted/10 px-4 py-4 sm:grid-cols-2">
              <TextField
                autoFocus
                label="First Name"
                value={form.firstName}
                placeholder="Enter first name"
                onChange={(firstName) => setForm({ ...form, firstName })}
              />
              <TextField
                label="Last Name"
                value={form.lastName}
                placeholder="Enter last name"
                onChange={(lastName) => setForm({ ...form, lastName })}
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                placeholder="yyyy-mm-dd"
                onChange={(dateOfBirth) => setForm({ ...form, dateOfBirth })}
              />

              <label className="flex min-w-0 flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Province
                </span>
                <select
                  required
                  value={form.province}
                  onChange={(event) =>
                    setForm({ ...form, province: event.target.value })
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

              <fieldset className="flex min-w-0 flex-col gap-1.5">
                <legend className="text-xs font-medium text-muted-foreground">
                  Gender
                </legend>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {(["Male", "Female"] as const).map((option) => {
                    const id = `gender-${option.toLowerCase()}`;
                    const isSelected = form.gender === option;
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
                          onChange={() => setForm({ ...form, gender: option })}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <TextField
                label="Email"
                type="email"
                value={form.email}
                placeholder="name@example.com"
                onChange={(email) => setForm({ ...form, email })}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border bg-background/40 px-4 py-3">
              <Button type="submit" disabled={!canGenerate}>
                <BadgeCheck className="h-4 w-4" />
                Generate
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </form>

          <LicencePreview result={result} />
        </div>
      </PageFrameBody>
    </PageFrame>
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

function LicencePreview({ result }: { result: LicenceResult | null }) {
  if (!result) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-6 text-center">
        <div className="max-w-sm">
          <IdCard className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Generated mock preview appears here.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            It will be marked as a non-official sample.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="relative overflow-hidden rounded-xl border border-border p-5 shadow-sm">
        <div className="relative flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-4">
            <div>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">
                {result.licenceNumber}
              </h2>
            </div>
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-right">
              <p className="text-xs font-bold uppercase text-destructive">
                Not official
              </p>
            </div>
          </div>

          <p className="mt-auto text-xs text-muted-foreground">
            This is a synthetic mock generated for demonstration and testing. It
            is not issued by, endorsed by, or usable with any government agency.
          </p>
        </div>
      </div>
    </section>
  );
}

function generateLicenceNumber(form: LicenceForm) {
  const source = `${form.firstName}|${form.lastName}|${form.dateOfBirth}|${form.province}|${form.email}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }

  return `SMP-${hash.toString(36).toUpperCase().padStart(8, "0").slice(0, 8)}`;
}
