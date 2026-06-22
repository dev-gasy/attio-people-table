import { UserRound } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible-section";
import { InsuranceRecordBlock } from "@/features/insurance/components/insurance-record-block";
import { getPartyFields } from "@/features/insurance/domain/insurance-detail";
import type { InsuranceParty } from "@/features/insurance/services/insurance.types";

type InsurancePartiesSectionProps = {
  parties: InsuranceParty[];
};

export function InsurancePartiesSection({
  parties,
}: InsurancePartiesSectionProps) {
  return (
    <Collapsible title="Parties" count={parties.length} icon={UserRound}>
      <div className="divide-y divide-border/60">
        {parties.map((party) => (
          <InsuranceRecordBlock
            key={party.id}
            title={party.name}
            fields={getPartyFields(party)}
            icon={UserRound}
          />
        ))}
      </div>
    </Collapsible>
  );
}
