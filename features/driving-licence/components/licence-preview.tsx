import {
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import type { LicenceResult } from "@/features/driving-licence/domain/licence";

type LicencePreviewProps = {
  canGenerate: boolean;
  result: LicenceResult | null;
};

export function LicencePreview({ canGenerate, result }: LicencePreviewProps) {
  return (
    <section
      aria-label="Generated licence preview"
      className="overflow-hidden rounded-xl border border-border bg-background"
    >
      {result ? (
        <LicenceCard result={result} />
      ) : (
        <EmptyState canGenerate={canGenerate} />
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Populated card
// ---------------------------------------------------------------------------

function LicenceCard({ result }: { result: LicenceResult }) {
  return (
    <div>
      {/* Header strip */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sample Driving Licence
          </span>
          <span className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {result.province}
          </span>
        </div>
        <span className="rounded border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive">
          Not official
        </span>
      </div>

      {/* Licence number */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Licence number
        </p>
        <p className="mt-0.5 font-mono text-2xl font-bold tracking-widest text-foreground">
          {result.licenceNumber}
        </p>
      </div>

      {/* Details grid */}
      <dl className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-3">
        <DetailCell icon={UserRound} label="Name" value={result.fullName} />
        <DetailCell icon={UserRound} label="Gender" value={result.gender} />
        <DetailCell
          icon={CalendarDays}
          label="Date of birth"
          value={`${result.dateOfBirth} (age ${result.age})`}
        />
        <DetailCell icon={MapPin} label="Province" value={result.province} />
        <DetailCell
          icon={CalendarDays}
          label="Issue date"
          value={result.issueDate}
        />
        <DetailCell
          icon={CalendarDays}
          label="Expiry date"
          value={result.expiryDate}
        />
        <DetailCell
          icon={Mail}
          label="Email"
          value={result.email}
          className="col-span-2 sm:col-span-3"
        />
      </dl>
    </div>
  );
}

function DetailCell({
  className = "",
  icon: Icon,
  label,
  value,
}: {
  className?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className={`bg-background px-4 py-3 ${className}`}>
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3 shrink-0" />
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ canGenerate }: { canGenerate: boolean }) {
  return (
    <div className="flex min-h-40 items-center justify-center p-6 text-center">
      <div className="max-w-64 space-y-2">
        {canGenerate ? (
          <>
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium text-foreground">
              Ready to generate
            </p>
            <p className="text-xs text-muted-foreground">
              All required fields are valid. Use Randomize to populate the form
              or submit to see results.
            </p>
          </>
        ) : (
          <>
            <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Complete the form above
            </p>
            <p className="text-xs text-muted-foreground">
              Fill in all required fields to generate a sample licence number.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
