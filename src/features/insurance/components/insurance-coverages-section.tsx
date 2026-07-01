import { ShieldCheck } from "lucide-react";
import { Collapsible } from "@/shared/components/ui/collapsible-section";
import { InsuranceRecordBlock } from "@/features/insurance/components/insurance-record-block";
import { getCoverageFields } from "@/features/insurance/domain/insurance-detail";
import type { InsuranceCoverage } from "@/features/insurance/services/insurance.types";

type InsuranceCoveragesSectionProps = {
  coverages: InsuranceCoverage[];
};

export function InsuranceCoveragesSection({
  coverages,
}: InsuranceCoveragesSectionProps) {
  return (
    <Collapsible title="Coverage" count={coverages.length} icon={ShieldCheck}>
      <div className="divide-y divide-border/60">
        {coverages.map((coverage) => (
          <InsuranceRecordBlock
            key={coverage.id}
            title={coverage.name}
            fields={getCoverageFields(coverage)}
            icon={ShieldCheck}
          />
        ))}
      </div>
    </Collapsible>
  );
}
