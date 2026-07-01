import { createFileRoute } from "@tanstack/react-router";
import { LookupsPage } from "@/features/lookups/components/lookups-page";
import { getStaticLookupNamesPayload } from "@/features/lookups/lookup-server";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/lookups_/$lookupName")({
  head: ({ params }) => {
    const lookupName =
      getStaticLookupNamesPayload().find(
        (lookup) => lookup.slug === params.lookupName,
      )?.name ?? params.lookupName;

    return {
      meta: buildPageMeta({
        title: lookupName,
        description: `Browse lookup values for ${lookupName} in CRM Demo.`,
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
