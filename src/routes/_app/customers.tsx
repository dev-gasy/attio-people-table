import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/features/customers/components/customers-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";

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
