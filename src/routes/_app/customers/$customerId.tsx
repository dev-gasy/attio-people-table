import { createFileRoute } from "@tanstack/react-router";
import { CustomerDetailPage } from "@/features/customers/components/detail/customer-detail-page";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";
import {
  DEFAULT_CUSTOMER_TAB,
  parseCustomerTab,
  type CustomerTab,
} from "@/features/customers/components/detail/customer-detail-constants";

type CustomerDetailSearch = {
  tab: CustomerTab;
};

export const Route = createFileRoute("/_app/customers/$customerId")({
  validateSearch: (search): CustomerDetailSearch => ({
    tab: parseCustomerTab(search.tab),
  }),
  head: ({ params }) => {
    return {
      meta: buildPageMeta({
        title: `Customer ${params.customerId}`,
        description: "View customer account details in CRM Demo.",
      }),
    };
  },
  errorComponent: (props) => <RouteErrorFallback title="Customer" {...props} />,
  component: CustomerRoute,
});

function CustomerRoute() {
  const { customerId } = Route.useParams();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  function setActiveTab(nextTab: CustomerTab) {
    void navigate({
      replace: true,
      search: {
        tab: nextTab === DEFAULT_CUSTOMER_TAB ? undefined : nextTab,
      },
    });
  }

  return (
    <CustomerDetailPage
      activeTab={tab}
      customerId={customerId}
      onTabChange={setActiveTab}
    />
  );
}
