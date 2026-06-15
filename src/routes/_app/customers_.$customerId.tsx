import { createFileRoute } from "@tanstack/react-router";
import { CustomerDetailPage } from "@/features/customers/components/customer-detail-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { customerQueryOptions } from "@/features/customers/customer-service";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/customers_/$customerId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      customerQueryOptions(Number(params.customerId)),
    ),
  head: ({ loaderData }) => {
    const customerName = loaderData?.customer?.name ?? "Customer";

    return {
      meta: buildPageMeta({
        title: customerName,
        description: loaderData?.customer
          ? `View ${customerName}'s account profile, contacts, and products.`
          : "View customer account details in Attio CRM.",
      }),
    };
  },
  errorComponent: (props) => <RouteErrorFallback title="Customer" {...props} />,
  component: CustomerRoute,
});

function CustomerRoute() {
  const { customerId } = Route.useParams();

  return <CustomerDetailPage customerId={customerId} />;
}
