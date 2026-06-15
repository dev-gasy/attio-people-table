import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "@/components/data-error-view";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { InsuranceCoveragesSection } from "@/features/insurance/components/insurance-coverages-section";
import {
  insuranceRouteLabels,
  type InsuranceTab,
} from "@/features/insurance/components/insurance-detail-constants";
import { InsuranceDetailHeader } from "@/features/insurance/components/insurance-detail-header";
import {
  InsuranceDetailError,
  InsuranceDetailLoading,
  InsuranceNotFound,
} from "@/features/insurance/components/insurance-detail-states";
import { InsuranceDetailTabs } from "@/features/insurance/components/insurance-detail-tabs";
import { InsurancePartiesSection } from "@/features/insurance/components/insurance-parties-section";
import { InsuranceSummarySection } from "@/features/insurance/components/insurance-summary-section";
import { InsuranceVehiclesSection } from "@/features/insurance/components/insurance-vehicles-section";
import { insuranceRecordQueryOptions } from "@/features/insurance/insurance-service";
import {
  mapInsuranceRecordDtoToRecord,
  type InsuranceRecordKind,
} from "@/features/insurance/insurance-mappers";

export function InsuranceDetailPage({
  businessKey,
  kind,
}: {
  businessKey: string;
  kind: InsuranceRecordKind;
}) {
  const [activeTab, setActiveTab] = useState<InsuranceTab>("details");
  const { data, error, isError, isFetching, isPending, refetch } = useQuery(
    insuranceRecordQueryOptions(kind, businessKey),
  );
  const record = useMemo(
    () =>
      data?.record ? mapInsuranceRecordDtoToRecord(data.record) : undefined,
    [data],
  );
  const label = insuranceRouteLabels[kind];

  if (isPending) {
    return <InsuranceDetailLoading />;
  }

  if (isError) {
    return (
      <InsuranceDetailError
        title={`Could not load ${label.title.toLowerCase()}`}
        message={getErrorMessage(error)}
        isRetrying={isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!record) {
    return <InsuranceNotFound title={label.missing} />;
  }

  return (
    <PageFrame>
      <InsuranceDetailHeader kind={kind} record={record} />
      <InsuranceDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <PageFrameBody>
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
      </PageFrameBody>
    </PageFrame>
  );
}
