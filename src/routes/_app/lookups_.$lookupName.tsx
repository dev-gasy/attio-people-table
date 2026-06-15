import { createFileRoute } from "@tanstack/react-router";
import { LookupsPage } from "@/features/lookups/components/lookups-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { lookupNameQueryOptions } from "@/features/lookups/lookup-service";

export const Route = createFileRoute("/_app/lookups_/$lookupName")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      lookupNameQueryOptions(params.lookupName),
    ),
  errorComponent: (props) => <RouteErrorFallback title="Lookups" {...props} />,
  component: LookupsRoute,
});

function LookupsRoute() {
  const { lookupName } = Route.useParams();

  return <LookupsPage lookupName={lookupName} />;
}
