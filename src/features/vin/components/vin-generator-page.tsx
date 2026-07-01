import { RotateCcw } from "lucide-react";
import {
  PageHeader,
  PageShell,
  PageContent,
} from "@/shared/components/page-shell";
import { Button } from "@/shared/components/ui/button";
import { VinGeneratorForm } from "@/features/vin/components/vin-generator-form";
import { VinResultCard } from "@/features/vin/components/vin-result-card";
import { VinValidatorPanel } from "@/features/vin/components/vin-validator-panel";
import { useVinGenerator } from "@/features/vin/use-vin-generator";
import type { VinGeneratorFormValues } from "@/features/vin/domain/vin";

type VinGeneratorPageProps = {
  initialFormValues?: VinGeneratorFormValues;
  initialValidatorInput?: string;
};

export function VinGeneratorPage({
  initialFormValues,
  initialValidatorInput,
}: VinGeneratorPageProps) {
  const generator = useVinGenerator({
    initialFormValues,
    initialValidatorInput,
  });

  return (
    <PageShell>
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

      <PageContent className="pb-8">
        <div className="flex flex-col gap-6">
          <VinGeneratorForm
            brands={generator.brands}
            formValues={generator.formValues}
            generatedVinError={generator.generatedVin.error}
            models={generator.models}
            onValueChange={generator.updateField}
            selectedWmi={generator.selectedWmi}
            wmis={generator.wmis}
          />

          <VinResultCard
            message={generator.generatedVin.error}
            result={generator.generatedVin.result}
          />

          <VinValidatorPanel
            value={generator.validatorInput}
            result={generator.validationResult}
            onChange={generator.setValidatorInput}
          />
        </div>
      </PageContent>
    </PageShell>
  );
}
