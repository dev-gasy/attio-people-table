import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/features/insurance/components/insurance-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { insuranceRecordQueryOptions } from "@/features/insurance/insurance-service";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/policies_/$businessKey")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      insuranceRecordQueryOptions("policy", params.businessKey),
    ),
  head: ({ loaderData, params }) => {
    const businessKey = loaderData?.record?.businessKey ?? params.businessKey;

    return {
      meta: buildPageMeta({
        title: `Policy ${businessKey}`,
        description: loaderData?.record
          ? `View policy ${businessKey} for ${loaderData.record.customerName}.`
          : `View policy ${businessKey} in Attio CRM.`,
      }),
    };
  },
  errorComponent: (props) => <RouteErrorFallback title="Policy" {...props} />,
  component: PolicyRoute,
});

function PolicyRoute() {
  const { businessKey } = Route.useParams();

  return <InsuranceDetailPage kind="policy" businessKey={businessKey} />;
}
