import { createFileRoute } from "@tanstack/react-router";
import { LookupsPage } from "@/features/lookups/components/lookups-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { lookupNameQueryOptions } from "@/features/lookups/lookup-service";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/lookups_/$lookupName")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      lookupNameQueryOptions(params.lookupName),
    ),
  head: ({ loaderData, params }) => {
    const lookupName = loaderData?.lookupName?.name ?? params.lookupName;

    return {
      meta: buildPageMeta({
        title: lookupName,
        description: `Browse lookup values for ${lookupName} in Attio CRM.`,
      }),
    };
  },
  errorComponent: (props) => <RouteErrorFallback title="Lookups" {...props} />,
  component: LookupsRoute,
});

function LookupsRoute() {
  const { lookupName } = Route.useParams();

  return <LookupsPage lookupName={lookupName} />;
}
