import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/features/customers/components/list/customers-page";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/customers")({
  head: () => ({
    meta: buildPageMeta({
      title: "Customers",
      description: "Browse and manage customer records in CRM Demo.",
    }),
  }),
  errorComponent: (props) => (
    <RouteErrorFallback title="Customers" {...props} />
  ),
  component: CustomersRoute,
});

function CustomersRoute() {
  return <CustomersPage />;
}
