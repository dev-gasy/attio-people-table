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

export const Route = createFileRoute("/_app/policies_/$businessKey")({
  validateSearch: (search): InsuranceDetailSearch => ({
    tab: parseInsuranceTab(search.tab),
  }),
  head: ({ params }) => {
    return {
      meta: buildPageMeta({
        title: `Policy ${params.businessKey}`,
        description: `View policy ${params.businessKey} in CRM Demo.`,
      }),
    };
  },
  errorComponent: (props) => <RouteErrorFallback title="Policy" {...props} />,
  component: PolicyRoute,
});

function PolicyRoute() {
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
      kind="policy"
      businessKey={businessKey}
      onTabChange={setActiveTab}
    />
  );
}
