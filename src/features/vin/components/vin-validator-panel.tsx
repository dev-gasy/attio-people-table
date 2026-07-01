import { BadgeX, CheckCircle2 } from "lucide-react";
import { Collapsible } from "@/shared/components/ui/collapsible-section";
import {
  TextInputField,
  type StringFieldApi,
} from "@/shared/components/ui/form-field";
import type { VinValidationResult } from "@/features/vin/domain/vin";
import { cn } from "@/shared/utils/utils";

type VinValidatorPanelProps = {
  onChange: (value: string) => void;
  result: VinValidationResult | null;
  value: string;
};

export function VinValidatorPanel({
  onChange,
  result,
  value,
}: VinValidatorPanelProps) {
  return (
    <Collapsible title="Validator" subtitle="Check VIN format and check digit">
      <div className="p-4 space-y-4">
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
        </div>

        <ValidationSummary result={result} />
      </div>
    </Collapsible>
  );
}

type ValidationSummaryProps = { result: VinValidationResult | null };

function ValidationSummary({ result }: ValidationSummaryProps) {
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
        <SummaryRow label="Normalized" value={result.normalizedVin || "-"} />
        <SummaryRow
          label="Actual check digit"
          value={result.actualCheckDigit ?? "-"}
        />
        <SummaryRow
          label="Expected check digit"
          value={result.expectedCheckDigit ?? "-"}
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

type SummaryRowProps = { label: string; value: string };

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono font-medium text-foreground">{value}</dd>
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
