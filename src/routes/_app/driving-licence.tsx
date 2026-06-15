import { createFileRoute } from "@tanstack/react-router";
import { DrivingLicencePage } from "@/features/driving-licence/components/driving-licence-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/driving-licence")({
  errorComponent: (props) => (
    <RouteErrorFallback title="Driving Licence" {...props} />
  ),
  component: DrivingLicencePage,
});
