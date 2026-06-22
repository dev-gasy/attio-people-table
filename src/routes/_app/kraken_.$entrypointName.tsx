import { createFileRoute } from "@tanstack/react-router";
import { KrakenPage } from "@/features/kraken/components/kraken-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { getStaticKrakenEntrypoints } from "@/features/kraken/kraken-service";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/kraken_/$entrypointName")({
  head: ({ params }) => {
    const entrypointName =
      getStaticKrakenEntrypoints().find(
        (entrypoint) => entrypoint.slug === params.entrypointName,
      )?.name ?? params.entrypointName;

    return {
      meta: buildPageMeta({
        title: entrypointName,
        description: `Inspect Kraken rules for ${entrypointName} in CRM Demo.`,
      }),
    };
  },
  errorComponent: (props) => <RouteErrorFallback title="Kraken" {...props} />,
  component: KrakenRoute,
});

function KrakenRoute() {
  const { entrypointName } = Route.useParams();

  return <KrakenPage entrypointName={entrypointName} />;
}
