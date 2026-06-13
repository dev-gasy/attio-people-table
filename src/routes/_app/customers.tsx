import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "@/components/customers/customers-page";

export const Route = createFileRoute("/_app/customers")({
  component: CustomersRoute,
});

function CustomersRoute() {
  return <CustomersPage />;
}
