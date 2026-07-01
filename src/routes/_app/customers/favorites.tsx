import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/features/customers/components/list/customers-page";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/customers/favorites")({
  head: () => ({
    meta: buildPageMeta({
      title: "Favorite Customers",
      description: "Review favorite customer records in CRM Demo.",
    }),
  }),
  errorComponent: (props) => (
    <RouteErrorFallback title="Favorite Customers" {...props} />
  ),
  component: FavoriteCustomersRoute,
});

function FavoriteCustomersRoute() {
  return <CustomersPage mode="favorites" />;
}
