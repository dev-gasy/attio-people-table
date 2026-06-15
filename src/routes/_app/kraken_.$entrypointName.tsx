import { createFileRoute } from "@tanstack/react-router";
import { KrakenPage } from "@/features/kraken/components/kraken-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { krakenEntrypointRulesQueryOptions } from "@/features/kraken/kraken-service";

export const Route = createFileRoute("/_app/kraken_/$entrypointName")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      krakenEntrypointRulesQueryOptions(params.entrypointName),
    ),
  errorComponent: (props) => <RouteErrorFallback title="Kraken" {...props} />,
  component: KrakenRoute,
});

function KrakenRoute() {
  const { entrypointName } = Route.useParams();

  return <KrakenPage entrypointName={entrypointName} />;
}
