import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { LicenceDetailsForm } from "@/features/driving-licence/components/licence-details-form";
import { LicencePreview } from "@/features/driving-licence/components/licence-preview";
import { useDrivingLicencePage } from "@/features/driving-licence/use-driving-licence-page";

export function DrivingLicencePage() {
  const { form, handleRandomize, handleReset, result } =
    useDrivingLicencePage();

  return (
    <PageFrame>
      <PageHeader title="Driving Licence" />

      <PageFrameBody className="pb-8">
        <div className="flex flex-col gap-6">
          <LicenceDetailsForm
            form={form}
            onRandomize={handleRandomize}
            onReset={handleReset}
          />

          <LicencePreview result={result} />
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}
