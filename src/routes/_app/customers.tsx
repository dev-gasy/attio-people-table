import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/components/customers/customers-page";
import { customersQueryOptions } from "@/features/customers/customer-service";

export const Route = createFileRoute("/_app/customers")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(customersQueryOptions()),
  component: CustomersRoute,
});

function CustomersRoute() {
  return <CustomersPage />;
}
