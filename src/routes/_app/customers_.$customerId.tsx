import { createFileRoute } from "@tanstack/react-router";
import { CustomerDetailPage } from "@/features/customers/components/detail/customer-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/customers_/$customerId")({
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

  return <CustomerDetailPage customerId={customerId} />;
}
