import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/features/insurance/components/insurance-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { insuranceRecordQueryOptions } from "@/features/insurance/insurance-service";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/quotes_/$businessKey")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      insuranceRecordQueryOptions("quote", params.businessKey),
    ),
  head: ({ loaderData, params }) => {
    const businessKey = loaderData?.record?.businessKey ?? params.businessKey;

    return {
      meta: buildPageMeta({
        title: `Quote ${businessKey}`,
        description: loaderData?.record
          ? `View quote ${businessKey} for ${loaderData.record.customerName}.`
          : `View quote ${businessKey} in Attio CRM.`,
      }),
    };
  },
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
