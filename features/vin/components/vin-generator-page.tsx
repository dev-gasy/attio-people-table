import { type ReactNode } from "react";
import {
  AlertTriangle,
  BadgeX,
  CarFront,
  CheckCircle2,
  Factory,
  RotateCcw,
} from "lucide-react";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { EmptyView } from "@/components/empty-view";
import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { Button } from "@/components/ui/button";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Collapsible } from "@/components/ui/collapsible-section";
import {
  TextInputField,
  type StringFieldApi,
} from "@/components/ui/form-field";
import { useVinGenerator } from "@/features/vin/use-vin-generator";
import type {
  VinGenerationResult,
  VinGeneratorFormValues,
  VinValidationResult,
} from "@/features/vin/services/vin.service";
import { cn } from "@/lib/utils";

type VinFieldName = keyof VinGeneratorFormValues;

export function VinGeneratorPage() {
  const generator = useVinGenerator();

  return (
    <PageFrame>
      <PageHeader
        title="VIN Generator"
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={generator.reset}
            disabled={generator.isFormEmpty && !generator.generatedVin.result}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        }
      />

      <PageFrameBody className="pb-8">
        <div className="flex flex-col gap-6">
          <VinGeneratorForm
            brandOptions={generator.brandOptions}
            brandsLoading={generator.brandsLoading}
            formValues={generator.formValues}
            modelDisabled={generator.modelDisabled}
            modelOptions={generator.modelOptions}
            modelsLoading={generator.modelsLoading}
            onValueChange={generator.updateFormValue}
            statusMessages={generator.statusMessages}
            wmiStatus={generator.wmiStatus}
            yearOptions={generator.yearOptions}
          />
          <VinResultCard result={generator.generatedVin.result} />
          <VinValidatorPanel
            value={generator.validatorInput}
            result={generator.validationResult}
            onChange={generator.setValidatorInput}
          />
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}

function VinGeneratorForm({
  brandOptions,
  brandsLoading,
  formValues,
  modelDisabled,
  modelOptions,
  modelsLoading,
  onValueChange,
  statusMessages,
  wmiStatus,
  yearOptions,
}: {
  brandOptions: ComboOption[];
  brandsLoading: boolean;
  formValues: VinGeneratorFormValues;
  modelDisabled: boolean;
  modelOptions: ComboOption[];
  modelsLoading: boolean;
  onValueChange: (field: VinFieldName, value: string | null) => void;
  statusMessages: string[];
  wmiStatus: string;
  yearOptions: ComboOption[];
}) {
  return (
    <Collapsible
      title="Generator"
      subtitle="VIN updates automatically when selections are complete"
    >
      <div className="grid gap-4 p-4 md:grid-cols-3">
        <ComboField label="Year">
          <Combobox
            options={yearOptions}
            value={formValues.year || null}
            onChange={(value) => onValueChange("year", value)}
            placeholder="Select year"
            searchPlaceholder="Search year..."
            icon={CarFront}
            clearable={false}
          />
        </ComboField>
        <ComboField label="Brand">
          <Combobox
            options={brandOptions}
            value={formValues.brand || null}
            onChange={(value) => onValueChange("brand", value)}
            placeholder={brandsLoading ? "Loading brands..." : "Search brand"}
            searchPlaceholder="Search brand..."
            icon={Factory}
            disabled={brandsLoading || brandOptions.length === 0}
          />
        </ComboField>
        <ComboField label="Model">
          <Combobox
            options={modelOptions}
            value={formValues.model || null}
            onChange={(value) => onValueChange("model", value)}
            placeholder={modelsLoading ? "Loading models..." : "Search model"}
            searchPlaceholder="Search model..."
            icon={CarFront}
            disabled={modelDisabled}
          />
        </ComboField>
      </div>

      <StatusMessages messages={statusMessages} />

      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        {wmiStatus}
      </div>
    </Collapsible>
  );
}

function VinResultCard({ result }: { result: VinGenerationResult | null }) {
  if (!result) {
    return (
      <section
        aria-label="Generated VIN preview"
        className="overflow-hidden rounded-xl border border-border bg-background"
      >
        <EmptyView
          expanded
          message="Select a year, brand, and model. The VIN will appear automatically."
        />
      </section>
    );
  }

  return (
    <section
      aria-label="Generated VIN preview"
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sample VIN
        </span>
        <span className="rounded border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive">
          Not official
        </span>
      </div>

      <div className="group flex items-end justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Vehicle Identification Number
          </p>
          <p className="mt-0.5 truncate font-mono text-2xl font-bold tracking-widest text-foreground">
            {result.vin}
          </p>
        </div>
        <CopyToClipboard value={result.vin} label="Copy VIN" />
      </div>

      <dl className="grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-3">
        <DetailCell
          icon={CarFront}
          label="Vehicle"
          value={`${result.year} ${result.brand} ${result.model}`}
        />
        <DetailCell
          icon={Factory}
          label="WMI"
          value={`${result.wmi} — ${result.wmiName}`}
        />
        <DetailCell
          icon={CheckCircle2}
          label="Check digit"
          value={result.checkDigit}
        />
      </dl>
    </section>
  );
}

function VinValidatorPanel({
  onChange,
  result,
  value,
}: {
  onChange: (value: string) => void;
  result: VinValidationResult | null;
  value: string;
}) {
  return (
    <Collapsible title="Validator" subtitle="Check VIN format and check digit">
      <div className="grid gap-5 p-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3">
          <TextInputField
            field={createTextField({
              name: "vin",
              value,
              onChange,
            })}
            label="VIN"
            placeholder="Paste a VIN, e.g. 1FA-CP45E-X-LF192944"
          />
          <p className="text-xs text-muted-foreground">
            Separators are ignored. The letters I, O, and Q are not allowed in
            VINs.
          </p>
        </div>

        <ValidationSummary result={result} />
      </div>
    </Collapsible>
  );
}

function ValidationSummary({ result }: { result: VinValidationResult | null }) {
  if (!result) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Paste a VIN to validate it locally.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-sm",
        result.isValid
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-destructive/40 bg-destructive/10",
      )}
    >
      <div className="flex items-center gap-2">
        {result.isValid ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <BadgeX className="h-4 w-4 text-destructive" />
        )}
        <p className="font-medium text-foreground">
          {result.isValid ? "Valid VIN" : "Invalid VIN"}
        </p>
      </div>

      <dl className="mt-3 grid gap-2 text-xs">
        <SummaryRow label="Normalized" value={result.normalizedVin || "—"} />
        <SummaryRow
          label="Actual check digit"
          value={result.actualCheckDigit ?? "—"}
        />
        <SummaryRow
          label="Expected check digit"
          value={result.expectedCheckDigit ?? "—"}
        />
      </dl>

      {result.errors.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-destructive">
          {result.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DetailCell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="group bg-background px-4 py-3">
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3 shrink-0" />
        {label}
      </dt>
      <dd className="mt-1 flex min-w-0 items-center gap-1 text-sm font-medium text-foreground">
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <CopyToClipboard value={value} label={`Copy ${label}`} />
      </dd>
    </div>
  );
}

function ComboField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono font-medium text-foreground">{value}</dd>
    </div>
  );
}

function StatusMessages({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-1 px-4 pb-3">
      {Array.from(new Set(messages)).map((message) => (
        <p
          key={message}
          className="flex items-center gap-2 text-xs text-destructive"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {message}
        </p>
      ))}
    </div>
  );
}

function createTextField({
  name,
  onChange,
  value,
}: {
  name: string;
  onChange: (value: string) => void;
  value: string;
}): StringFieldApi<string> {
  return {
    name,
    state: {
      value,
      meta: {},
    },
    handleBlur: () => undefined,
    handleChange: onChange,
  };
}
