import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/features/insurance/components/insurance-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";
import {
  DEFAULT_INSURANCE_TAB,
  parseInsuranceTab,
  type InsuranceTab,
} from "@/features/insurance/components/insurance-detail-constants";

type InsuranceDetailSearch = {
  tab: InsuranceTab;
};

export const Route = createFileRoute(
  "/_app/quotes_/$businessKey/$revisionNumber",
)({
  validateSearch: (search): InsuranceDetailSearch => ({
    tab: parseInsuranceTab(search.tab),
  }),
  params: {
    parse: (params) => {
      const revisionNumber = Number(params.revisionNumber);

      if (!Number.isFinite(revisionNumber)) return false;

      return { ...params, revisionNumber };
    },
    stringify: (params) => ({
      ...params,
      revisionNumber: String(params.revisionNumber),
    }),
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
      search: {
        tab: nextTab === DEFAULT_INSURANCE_TAB ? undefined : nextTab,
      },
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
