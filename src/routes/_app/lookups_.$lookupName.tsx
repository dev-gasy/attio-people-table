import { createFileRoute } from "@tanstack/react-router";
import { LookupsPage } from "@/components/lookups/lookups-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/lookups_/$lookupName")({
  errorComponent: (props) => <RouteErrorFallback title="Lookups" {...props} />,
  component: LookupsRoute,
});

function LookupsRoute() {
  const { lookupName } = Route.useParams();

  return <LookupsPage lookupName={lookupName} />;
}
