import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/components/insurance/insurance-detail-page";

export const Route = createFileRoute("/_app/quotes_/$businessKey")({
  validateSearch: (search): { revisionNumber?: string } => ({
    revisionNumber:
      typeof search.revisionNumber === "string"
        ? search.revisionNumber
        : undefined,
  }),
  component: QuoteRoute,
});

function QuoteRoute() {
  const { businessKey } = Route.useParams();

  return <InsuranceDetailPage kind="quote" businessKey={businessKey} />;
}
