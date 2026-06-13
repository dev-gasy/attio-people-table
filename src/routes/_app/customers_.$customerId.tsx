import { createFileRoute } from "@tanstack/react-router";
import { CustomerDetailPage } from "@/components/customers/customer-detail-page";

export const Route = createFileRoute("/_app/customers_/$customerId")({
  component: CustomerRoute,
});

function CustomerRoute() {
  const { customerId } = Route.useParams();

  return <CustomerDetailPage customerId={customerId} />;
}
