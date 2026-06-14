import { createFileRoute } from "@tanstack/react-router";
import { KrakenPage } from "@/components/kraken/kraken-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/kraken")({
  errorComponent: (props) => <RouteErrorFallback title="Kraken" {...props} />,
  component: KrakenPage,
});
