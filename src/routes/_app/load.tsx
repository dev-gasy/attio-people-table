import { createFileRoute } from "@tanstack/react-router";
import { InsuranceLookupPage } from "@/features/insurance/components/insurance-lookup-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/load")({
  errorComponent: (props) => (
    <RouteErrorFallback title="Policy/Quote" {...props} />
  ),
  component: LoadRoute,
});

function LoadRoute() {
  return <InsuranceLookupPage />;
}
