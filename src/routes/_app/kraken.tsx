import { createFileRoute } from "@tanstack/react-router";
import { KrakenPage } from "@/features/kraken/components/kraken-page";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/kraken")({
  head: () => ({
    meta: buildPageMeta({
      title: "Kraken",
      description: "Inspect Kraken entrypoints and rules in CRM Demo.",
    }),
  }),
  errorComponent: (props) => <RouteErrorFallback title="Kraken" {...props} />,
  component: KrakenPage,
});
