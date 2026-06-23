import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/features/insurance/components/insurance-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";
import { type InsuranceTab } from "@/features/insurance/components/insurance-detail-constants";
import {
  buildInsuranceTabSearch,
  parseQuoteRevisionParams,
  stringifyQuoteRevisionParams,
  validateInsuranceDetailSearch,
} from "@/features/insurance/insurance-route";

export const Route = createFileRoute(
  "/_app/quotes_/$businessKey/$revisionNumber",
)({
  validateSearch: validateInsuranceDetailSearch,
  params: {
    parse: parseQuoteRevisionParams,
    stringify: stringifyQuoteRevisionParams,
  },
  head: ({ params }) => {
    return {
      meta: buildPageMeta({
        title: `Quote ${params.businessKey}`,
        description: `View quote ${params.businessKey} in CRM Demo.`,
      }),
    };
  },
  errorComponent: (props) => <RouteErrorFallback title="Quote" {...props} />,
  component: QuoteRoute,
});

function QuoteRoute() {
  const { businessKey } = Route.useParams();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  function setActiveTab(nextTab: InsuranceTab) {
    void navigate({
      replace: true,
      search: buildInsuranceTabSearch(nextTab),
    });
  }

  return (
    <InsuranceDetailPage
      activeTab={tab}
      kind="quote"
      businessKey={businessKey}
      onTabChange={setActiveTab}
    />
  );
}
