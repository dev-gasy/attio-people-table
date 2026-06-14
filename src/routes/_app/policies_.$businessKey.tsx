import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/components/insurance/insurance-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/policies_/$businessKey")({
  errorComponent: (props) => <RouteErrorFallback title="Policy" {...props} />,
  component: PolicyRoute,
});

function PolicyRoute() {
  const { businessKey } = Route.useParams();

  return <InsuranceDetailPage kind="policy" businessKey={businessKey} />;
}
