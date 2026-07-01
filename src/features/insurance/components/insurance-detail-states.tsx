import { FileQuestion, FileText } from "lucide-react";
import {
  PageFrame,
  PageFrameBody,
  PageFrameHeader,
} from "@/shared/components/page-frame";
import { InsuranceDetailBackLink } from "@/features/insurance/components/insurance-detail-back-link";
import {
  insuranceKindStyles,
  insuranceRouteLabels,
} from "@/features/insurance/components/insurance-detail-constants";
import { InsuranceDetailTabs } from "@/features/insurance/components/insurance-detail-tabs";
import type { InsuranceRecordKind } from "@/features/insurance/services/insurance.types";
import { cn } from "@/shared/utils/utils";

export function InsuranceDetailLoading() {
  return (
    <PageFrame>
      <PageFrameHeader>
        <div className="flex flex-wrap items-center gap-4">
          <InsuranceDetailBackLink />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="h-7 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </PageFrameHeader>
      <InsuranceDetailTabs
        activeTab="details"
        disabled
        onTabChange={() => {}}
      />
      <PageFrameBody>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 px-4 py-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-44 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}

type InsuranceNotFoundProps = {
  businessKey: string;
  kind: InsuranceRecordKind;
  title: string;
};

export function InsuranceNotFound({
  businessKey,
  kind,
  title,
}: InsuranceNotFoundProps) {
  const label = insuranceRouteLabels[kind];
  const style = insuranceKindStyles[kind];

  return (
    <PageFrame>
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
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="truncate text-2xl font-semibold text-foreground">
            {label.title} {businessKey}
          </h1>
        </div>
      </PageFrameHeader>
      <PageFrameBody centered>
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileQuestion className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This record does not exist or is no longer available.
          </p>
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}
