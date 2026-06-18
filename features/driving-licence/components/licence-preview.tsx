import { CheckCircle2, ShieldAlert } from "lucide-react";
import type { LicenceResult } from "@/features/driving-licence/domain/licence";

type LicencePreviewProps = {
  canGenerate: boolean;
  result: LicenceResult | null;
};

export function LicencePreview({ canGenerate, result }: LicencePreviewProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-background">
      {result ? (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Generated number
            </p>
            <p className="mt-1 break-all text-2xl font-semibold text-foreground">
              {result.licenceNumber}
            </p>
          </div>
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-right">
            <p className="text-xs font-bold uppercase text-destructive">
              Not official
            </p>
          </div>
        </div>
      ) : (
        <EmptyLicenceNumber canGenerate={canGenerate} />
      )}
    </section>
  );
}

function EmptyLicenceNumber({ canGenerate }: { canGenerate: boolean }) {
  return (
    <div className="flex min-h-32 items-center justify-center p-6 text-center">
      <div className="max-w-64">
        {canGenerate ? (
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        )}
        <p className="text-sm font-medium text-foreground">
          {canGenerate ? "Ready to generate" : "Complete the required fields"}
        </p>
      </div>
    </div>
  );
}
