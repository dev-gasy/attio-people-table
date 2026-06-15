import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/features/customers/components/customers-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/customers")({
  errorComponent: (props) => (
    <RouteErrorFallback title="Customers" {...props} />
  ),
  component: CustomersRoute,
});

function CustomersRoute() {
  return <CustomersPage />;
}
