import { createFileRoute } from "@tanstack/react-router";
import { LookupsPage } from "@/components/lookups/lookups-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/lookups")({
  errorComponent: (props) => <RouteErrorFallback title="Lookups" {...props} />,
  component: LookupsPage,
});
