import { Suspense } from "react";
import { PageShell, PageContent } from "@/shared/components/page-shell";
import { InsuranceCoveragesSection } from "@/features/insurance/components/insurance-coverages-section";
import {
  insuranceRouteLabels,
  type InsuranceTab,
} from "@/features/insurance/components/insurance-detail-constants";
import { InsuranceDetailHeader } from "@/features/insurance/components/insurance-detail-header";
import {
  InsuranceDetailLoading,
  InsuranceNotFound,
} from "@/features/insurance/components/insurance-detail-states";
import { InsuranceDetailTabs } from "@/features/insurance/components/insurance-detail-tabs";
import { InsurancePartiesSection } from "@/features/insurance/components/insurance-parties-section";
import { InsuranceSummarySection } from "@/features/insurance/components/insurance-summary-section";
import { InsuranceVehiclesSection } from "@/features/insurance/components/insurance-vehicles-section";
import { useSuspenseInsuranceRecordQuery } from "@/features/insurance/services/insurance.queries";
import type { InsuranceRecordKind } from "@/features/insurance/services/insurance.types";

type InsuranceDetailPageProps = {
  activeTab: InsuranceTab;
  businessKey: string;
  kind: InsuranceRecordKind;
  onTabChange: (tab: InsuranceTab) => void;
};

export function InsuranceDetailPage({
  activeTab,
  businessKey,
  kind,
  onTabChange,
}: InsuranceDetailPageProps) {
  return (
    <Suspense fallback={<InsuranceDetailLoading />}>
      <InsuranceDetailDataLayer
        activeTab={activeTab}
        businessKey={businessKey}
        kind={kind}
        onTabChange={onTabChange}
      />
    </Suspense>
  );
}

function InsuranceDetailDataLayer({
  activeTab,
  businessKey,
  kind,
  onTabChange,
}: InsuranceDetailPageProps) {
  const { data } = useSuspenseInsuranceRecordQuery(kind, businessKey);
  const record = data?.record;
  const label = insuranceRouteLabels[kind];

  if (!record) {
    return (
      <InsuranceNotFound
        businessKey={businessKey}
        kind={kind}
        title={label.missing}
      />
    );
  }

  return (
    <PageShell>
      <InsuranceDetailHeader kind={kind} record={record} />
      <InsuranceDetailTabs activeTab={activeTab} onTabChange={onTabChange} />
      <PageContent>
        {activeTab === "details" && (
          <InsuranceSummarySection kind={kind} record={record} />
        )}
        {activeTab === "parties" && (
          <InsurancePartiesSection parties={record.parties} />
        )}
        {activeTab === "vehicles" && (
          <InsuranceVehiclesSection vehicles={record.vehicles} />
        )}
        {activeTab === "coverage" && (
          <InsuranceCoveragesSection coverages={record.coverages} />
        )}
      </PageContent>
    </PageShell>
  );
}
