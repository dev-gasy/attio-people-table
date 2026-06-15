import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/features/customers/components/customers-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { customersQueryOptions } from "@/features/customers/customer-service";

export const Route = createFileRoute("/_app/customers_/favorites")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(customersQueryOptions()),
  errorComponent: (props) => (
    <RouteErrorFallback title="Favorite Customers" {...props} />
  ),
  component: FavoriteCustomersRoute,
});

function FavoriteCustomersRoute() {
  return <CustomersPage mode="favorites" />;
}
