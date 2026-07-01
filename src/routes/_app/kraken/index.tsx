import { createFileRoute } from "@tanstack/react-router";
import {
  KrakenPage,
  type KrakenSearch,
} from "@/features/kraken/components/kraken-page";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/kraken/")({
  validateSearch: (search): KrakenSearch => ({
    entrypoint:
      typeof search.entrypoint === "string" ? search.entrypoint : undefined,
  }),
  head: () => ({
    meta: buildPageMeta({
      title: "Kraken",
      description: "Inspect Kraken entrypoints and rules in CRM Demo.",
    }),
  }),
  errorComponent: (props) => <RouteErrorFallback title="Kraken" {...props} />,
  component: KrakenRoute,
});

function KrakenRoute() {
  const search = Route.useSearch();
  return <KrakenPage filters={search} />;
}
