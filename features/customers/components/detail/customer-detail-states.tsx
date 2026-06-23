import {
  PageFrame,
  PageFrameBody,
  PageFrameHeader,
} from "@/components/page-frame";
import { CustomerDetailBackLink } from "@/features/customers/components/detail/customer-detail-back-link";
import { CustomerDetailTabs } from "@/features/customers/components/detail/customer-detail-tabs";

export function CustomerDetailLoading() {
  return (
    <PageFrame>
      <PageFrameHeader>
        <div className="flex flex-wrap items-center gap-4">
          <CustomerDetailBackLink />
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-7 w-52 animate-pulse rounded bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </PageFrameHeader>

      <CustomerDetailTabs activeTab="details" disabled onTabChange={() => {}} />

      <PageFrameBody>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <section
              key={index}
              className="overflow-hidden rounded-xl border border-border"
            >
              <div className="flex items-center gap-2.5 bg-muted/30 px-4 py-3">
                <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              </div>
              <div className="border-t border-border px-4 py-4">
                <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {Array.from({ length: index === 1 ? 3 : 4 }).map(
                    (_, rowIndex) => (
                      <div key={rowIndex} className="min-w-0">
                        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-3 w-44 animate-pulse rounded bg-muted" />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}

export function CustomerNotFound() {
  return (
    <PageFrame>
      <PageFrameHeader>
        <CustomerDetailBackLink />
      </PageFrameHeader>
      <PageFrameBody className="flex items-center justify-center">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Customer not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This customer record does not exist or is no longer available.
          </p>
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}
