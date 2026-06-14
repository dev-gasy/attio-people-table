import { createFileRoute } from "@tanstack/react-router";
import { CustomerDetailPage } from "@/components/customers/customer-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/customers_/$customerId")({
  errorComponent: (props) => <RouteErrorFallback title="Customer" {...props} />,
  component: CustomerRoute,
});

function CustomerRoute() {
  const { customerId } = Route.useParams();

  return <CustomerDetailPage customerId={customerId} />;
}
