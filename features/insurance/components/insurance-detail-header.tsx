import { FileText } from "lucide-react";
import { PageFrameHeader } from "@/components/page-frame";
import { InsuranceDetailBackLink } from "@/features/insurance/components/insurance-detail-back-link";
import {
  insuranceKindStyles,
  insuranceRouteLabels,
} from "@/features/insurance/components/insurance-detail-constants";
import type {
  InsuranceRecord,
  InsuranceRecordKind,
} from "@/features/insurance/insurance-mappers";
import { cn } from "@/lib/utils";

export function InsuranceDetailHeader({
  kind,
  record,
}: {
  kind: InsuranceRecordKind;
  record: InsuranceRecord;
}) {
  const label = insuranceRouteLabels[kind];
  const style = insuranceKindStyles[kind];

  return (
    <PageFrameHeader>
      <div className="flex flex-wrap items-center gap-4">
        <InsuranceDetailBackLink />
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            style.iconBackground,
            style.iconText,
          )}
        >
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-semibold text-foreground">
              {label.title} {record.businessKey}
            </h1>
            <span
              className={cn(
                "inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-1 text-sm",
                style.badge,
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", style.dot)} />
              {record.status}
            </span>
          </div>
        </div>
      </div>
    </PageFrameHeader>
  );
}
