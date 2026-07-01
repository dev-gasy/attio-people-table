import { createFileRoute } from "@tanstack/react-router";
import { LookupsPage } from "@/features/lookups/components/lookups-page";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/lookups/")({
  head: () => ({
    meta: buildPageMeta({
      title: "Lookups",
      description: "Explore lookup names and lookup values in CRM Demo.",
    }),
  }),
  errorComponent: (props) => <RouteErrorFallback title="Lookups" {...props} />,
  component: LookupsPage,
});
