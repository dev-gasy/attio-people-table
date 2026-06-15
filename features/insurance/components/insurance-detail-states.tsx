import { DataErrorView } from "@/components/data-error-view";
import {
  PageFrame,
  PageFrameBody,
  PageFrameHeader,
} from "@/components/page-frame";
import { InsuranceDetailBackLink } from "@/features/insurance/components/insurance-detail-back-link";
import { InsuranceDetailTabs } from "@/features/insurance/components/insurance-detail-tabs";

export function InsuranceDetailError({
  title,
  message,
  isRetrying,
  onRetry,
}: {
  title: string;
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
}) {
  return (
    <PageFrame>
      <PageFrameHeader>
        <InsuranceDetailBackLink />
      </PageFrameHeader>
      <PageFrameBody className="flex items-center justify-center">
        <DataErrorView
          title={title}
          message={message}
          onRetry={onRetry}
          isRetrying={isRetrying}
        />
      </PageFrameBody>
    </PageFrame>
  );
}

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

export function InsuranceNotFound({ title }: { title: string }) {
  return (
    <PageFrame>
      <PageFrameHeader>
        <InsuranceDetailBackLink />
      </PageFrameHeader>
      <PageFrameBody className="flex items-center justify-center">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This record does not exist or is no longer available.
          </p>
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}
