import { createFileRoute } from "@tanstack/react-router";
import { VinGeneratorPage } from "@/features/vin/components/vin-generator-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";

type VinSearch = {
  vin?: string;
};

export const Route = createFileRoute("/_app/vin")({
  validateSearch: (search): VinSearch => ({
    vin: typeof search.vin === "string" ? search.vin : undefined,
  }),
  head: () => ({
    meta: buildPageMeta({
      title: "VIN Generator",
      description:
        "Generate and validate sample vehicle identification numbers.",
    }),
  }),
  errorComponent: (props) => <RouteErrorFallback title="VIN" {...props} />,
  component: VinRouteComponent,
});

function VinRouteComponent() {
  const { vin } = Route.useSearch();
  return <VinGeneratorPage initialValidatorInput={vin ?? ""} />;
}
