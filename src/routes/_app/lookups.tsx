import { createFileRoute } from "@tanstack/react-router";
import { LookupsPage } from "@/features/lookups/components/lookups-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/lookups")({
  errorComponent: (props) => <RouteErrorFallback title="Lookups" {...props} />,
  component: LookupsPage,
});
