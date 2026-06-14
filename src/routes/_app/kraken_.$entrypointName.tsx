import { createFileRoute, notFound } from "@tanstack/react-router";
import { krakenEntrypointsQueryOptions } from "@/features/kraken/kraken-service";
import { KrakenPage, KrakenPageLoading } from "@/components/kraken/kraken-page";
import { PageHeader } from "@/components/page-header";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/kraken_/$entrypointName")({
  loader: async ({ context, params }) => {
    const entrypoints = await context.queryClient.ensureQueryData(
      krakenEntrypointsQueryOptions(),
    );

    if (
      !entrypoints.some(
        (entrypoint) => entrypoint.slug === params.entrypointName,
      )
    ) {
      throw notFound();
    }
  },
  pendingComponent: KrakenPageLoading,
  notFoundComponent: KrakenEntrypointNotFound,
  errorComponent: (props) => <RouteErrorFallback title="Kraken" {...props} />,
  component: KrakenRoute,
});

function KrakenRoute() {
  const { entrypointName } = Route.useParams();

  return <KrakenPage entrypointName={entrypointName} />;
}

function KrakenEntrypointNotFound() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader title="Kraken" />
      <div className="px-6 py-10 text-sm text-muted-foreground">
        Entrypoint not found
      </div>
    </div>
  );
}
