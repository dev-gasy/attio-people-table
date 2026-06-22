import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/features/insurance/components/insurance-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/policies_/$businessKey")({
  head: ({ params }) => {
    return {
      meta: buildPageMeta({
        title: `Policy ${params.businessKey}`,
        description: `View policy ${params.businessKey} in CRM Demo.`,
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
