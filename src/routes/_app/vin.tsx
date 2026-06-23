import { createFileRoute } from "@tanstack/react-router";
import { VinGeneratorPage } from "@/features/vin/components/vin-generator-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";

type VinSearch = {
  brand?: string;
  model?: string;
  vin?: string;
  year?: string;
};

export const Route = createFileRoute("/_app/vin")({
  validateSearch: (search): VinSearch => ({
    brand: toOptionalSearchString(search.brand),
    model: toOptionalSearchString(search.model),
    vin: typeof search.vin === "string" ? search.vin : undefined,
    year: toOptionalSearchString(search.year),
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
  const { brand, model, vin, year } = Route.useSearch();
  return (
    <VinGeneratorPage
      initialFormValues={{
        brand: brand ?? "",
        model: model ?? "",
        year: year ?? "",
      }}
      initialValidatorInput={vin ?? ""}
    />
  );
}

function toOptionalSearchString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}
