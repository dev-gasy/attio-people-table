import { createFileRoute } from "@tanstack/react-router";
import { CustomerDetailPage } from "@/components/customers/customer-detail-page";
import { customerQueryOptions } from "@/features/customers/customer-service";
import { mapCustomerDtoToCustomer } from "@/features/customers/customer-mappers";

export const Route = createFileRoute("/_app/customers_/$customerId")({
  loader: ({ context, params }) => {
    const customerId = Number(params.customerId);

    if (!Number.isFinite(customerId)) {
      return null;
    }

    return context.queryClient.ensureQueryData(customerQueryOptions(customerId));
  },
  component: CustomerRoute,
});

function CustomerRoute() {
  const data = Route.useLoaderData();
  const customer = data?.customer
    ? mapCustomerDtoToCustomer(data.customer, data.contacts, data.products)
    : null;

  return <CustomerDetailPage customer={customer} />;
}
