import { RotateCcw, Shuffle } from "lucide-react";
import {
  PageHeader,
  PageShell,
  PageContent,
} from "@/shared/components/page-shell";
import { Button } from "@/shared/components/ui/button";
import { LicenceDetailsForm } from "@/features/driving-licence/components/licence-details-form";
import { LicencePreview } from "@/features/driving-licence/components/licence-preview";
import { useDrivingLicencePage } from "@/features/driving-licence/use-driving-licence-page";

export function DrivingLicencePage() {
  const {
    canGenerate,
    filledCount,
    form,
    handleRandomize,
    handleReset,
    isFormEmpty,
    result,
    totalFields,
  } = useDrivingLicencePage();

  return (
    <PageShell>
      <PageHeader
        title="Driving Licence"
        actions={
          <>
            <Button type="button" variant="outline" onClick={handleRandomize}>
              <Shuffle className="h-4 w-4" />
              Randomize
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isFormEmpty}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </>
        }
      />

      <PageContent className="pb-8">
        <div className="flex flex-col gap-6">
          <LicenceDetailsForm
            filledCount={filledCount}
            form={form}
            totalFields={totalFields}
          />
          <LicencePreview canGenerate={canGenerate} result={result} />
        </div>
      </PageContent>
    </PageShell>
  );
}
