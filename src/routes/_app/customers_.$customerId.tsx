import { createFileRoute } from "@tanstack/react-router";
import { CustomerDetailPage } from "@/features/customers/components/customer-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { customerQueryOptions } from "@/features/customers/customer-service";

export const Route = createFileRoute("/_app/customers_/$customerId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      customerQueryOptions(Number(params.customerId)),
    ),
  errorComponent: (props) => <RouteErrorFallback title="Customer" {...props} />,
  component: CustomerRoute,
});

function CustomerRoute() {
  const { customerId } = Route.useParams();

  return <CustomerDetailPage customerId={customerId} />;
}
