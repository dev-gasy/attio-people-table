import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/components/insurance/insurance-detail-page";

export const Route = createFileRoute("/_app/policies_/$businessKey")({
  component: PolicyRoute,
});

function PolicyRoute() {
  const { businessKey } = Route.useParams();

  return <InsuranceDetailPage kind="policy" businessKey={businessKey} />;
}
