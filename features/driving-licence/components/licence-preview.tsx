import { IdCard } from "lucide-react";
import type { LicenceResult } from "@/features/driving-licence/domain/licence";

export function LicencePreview({ result }: { result: LicenceResult | null }) {
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
