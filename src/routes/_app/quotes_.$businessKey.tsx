import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/features/insurance/components/insurance-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { insuranceRecordQueryOptions } from "@/features/insurance/insurance-service";

export const Route = createFileRoute("/_app/quotes_/$businessKey")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      insuranceRecordQueryOptions("quote", params.businessKey),
    ),
  validateSearch: (search): { revisionNumber?: string } => ({
    revisionNumber:
      typeof search.revisionNumber === "string"
        ? search.revisionNumber
        : undefined,
  }),
  errorComponent: (props) => <RouteErrorFallback title="Quote" {...props} />,
  component: QuoteRoute,
});

function QuoteRoute() {
  const { businessKey } = Route.useParams();

  return <InsuranceDetailPage kind="quote" businessKey={businessKey} />;
}
