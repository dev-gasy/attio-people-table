import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDetailPage } from "@/features/insurance/components/insurance-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";
import { type InsuranceTab } from "@/features/insurance/components/insurance-detail-constants";
import {
  buildInsuranceTabSearch,
  validateInsuranceDetailSearch,
} from "@/features/insurance/insurance-route";

export const Route = createFileRoute("/_app/policies_/$businessKey")({
  validateSearch: validateInsuranceDetailSearch,
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
      search: buildInsuranceTabSearch(nextTab),
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
