import { FileText } from "lucide-react";
import { FieldGrid } from "@/components/field-grid";
import { Collapsible } from "@/components/ui/collapsible-section";
import {
  insuranceKindStyles,
  insuranceRouteLabels,
} from "@/features/insurance/components/insurance-detail-constants";
import { getInsuranceSummaryFields } from "@/features/insurance/domain/insurance-detail";
import type {
  InsuranceRecord,
  InsuranceRecordKind,
} from "@/features/insurance/insurance-mappers";

export function InsuranceSummarySection({
  kind,
  record,
}: {
  kind: InsuranceRecordKind;
  record: InsuranceRecord;
}) {
  const label = insuranceRouteLabels[kind];
  const style = insuranceKindStyles[kind];

  return (
    <Collapsible
      title={`${label.title} details`}
      icon={FileText}
      iconClassName={style.iconText}
    >
      <FieldGrid fields={getInsuranceSummaryFields(record)} />
    </Collapsible>
  );
}
