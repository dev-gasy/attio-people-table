import { createFileRoute } from "@tanstack/react-router";
import { InsuranceLookupPage } from "@/components/insurance/insurance-lookup-page";

export const Route = createFileRoute("/_app/load")({
  component: LoadRoute,
});

function LoadRoute() {
  return <InsuranceLookupPage />;
}
