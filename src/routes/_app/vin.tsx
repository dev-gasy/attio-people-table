import { createFileRoute } from "@tanstack/react-router";
import { VinGeneratorPage } from "@/features/vin/components/vin-generator-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/vin")({
  head: () => ({
    meta: buildPageMeta({
      title: "VIN Generator",
      description:
        "Generate and validate sample vehicle identification numbers.",
    }),
  }),
  errorComponent: (props) => <RouteErrorFallback title="VIN" {...props} />,
  component: VinGeneratorPage,
});
