import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/components/customers/customers-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/customers_/favorites")({
  errorComponent: (props) => (
    <RouteErrorFallback title="Favorite Customers" {...props} />
  ),
  component: FavoriteCustomersRoute,
});

function FavoriteCustomersRoute() {
  return <CustomersPage mode="favorites" />;
}
