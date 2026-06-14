import { createFileRoute } from "@tanstack/react-router";
import { InsuranceLookupPage } from "@/components/insurance/insurance-lookup-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/load")({
  errorComponent: (props) => <RouteErrorFallback title="Load" {...props} />,
  component: LoadRoute,
});

function LoadRoute() {
  return <InsuranceLookupPage />;
}
