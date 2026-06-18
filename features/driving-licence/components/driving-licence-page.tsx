import { RotateCcw, Shuffle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { Button } from "@/components/ui/button";
import { LicenceDetailsForm } from "@/features/driving-licence/components/licence-details-form";
import { LicencePreview } from "@/features/driving-licence/components/licence-preview";
import { useDrivingLicencePage } from "@/features/driving-licence/use-driving-licence-page";

export function DrivingLicencePage() {
  const { canGenerate, form, handleRandomize, handleReset, result } =
    useDrivingLicencePage();

  return (
    <PageFrame>
      <PageHeader
        title="Driving Licence"
        actions={
          <>
            <Button type="button" variant="outline" onClick={handleRandomize}>
              <Shuffle className="h-4 w-4" />
              Randomize
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </>
        }
      />

      <PageFrameBody className="pb-8">
        <div className="flex flex-col gap-6">
          <LicenceDetailsForm form={form} />
          <LicencePreview canGenerate={canGenerate} result={result} />
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}
