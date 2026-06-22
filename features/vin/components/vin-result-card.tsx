import type { ComponentType } from "react";
import { AlertTriangle, CarFront, CheckCircle2, Factory } from "lucide-react";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { EmptyView } from "@/components/empty-view";
import type { VinGenerationResult } from "@/features/vin/domain/vin";

export function VinResultCard({
  message,
  result,
}: {
  message: string | null;
  result: VinGenerationResult | null;
}) {
  if (!result) {
    return (
      <section
        aria-label="Generated VIN preview"
        className="overflow-hidden rounded-xl border border-border bg-background"
      >
        {message ? (
          <div className="flex min-h-40 items-center justify-center p-6 text-center">
            <div className="max-w-sm">
              <AlertTriangle className="mx-auto h-7 w-7 text-muted-foreground/70" />
              <p className="mt-3 text-sm font-medium text-foreground">
                VIN unavailable
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{message}</p>
            </div>
          </div>
        ) : (
          <EmptyView
            expanded
            message="Select a year, brand, and model. The VIN will appear automatically."
          />
        )}
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
          value={`${result.wmi} - ${result.wmiName}`}
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

function DetailCell({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
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
