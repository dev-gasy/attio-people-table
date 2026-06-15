import { createFileRoute } from "@tanstack/react-router";
import { DrivingLicencePage } from "@/features/driving-licence/components/driving-licence-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/driving-licence")({
  head: () => ({
    meta: buildPageMeta({
      title: "Driving Licence",
      description: "Preview and validate driving licence details in CRM Demo.",
    }),
  }),
  errorComponent: (props) => (
    <RouteErrorFallback title="Driving Licence" {...props} />
  ),
  component: DrivingLicencePage,
});
