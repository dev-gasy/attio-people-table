import { createFileRoute } from "@tanstack/react-router";
import { InsuranceLookupPage } from "@/features/insurance/components/insurance-lookup-page";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/load")({
  head: () => ({
    meta: buildPageMeta({
      title: "Policy/Quote",
      description: "Load policy and quote records by business key.",
    }),
  }),
  errorComponent: (props) => (
    <RouteErrorFallback title="Policy/Quote" {...props} />
  ),
  component: LoadRoute,
});

function LoadRoute() {
  return <InsuranceLookupPage />;
}
