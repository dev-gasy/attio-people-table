import {
  customerContactsSeed,
  customerProductsSeed,
  customersSeed,
} from "@/features/customers/customer-dtos";
import { waitForServiceLatency } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/customers/$customerId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        await waitForServiceLatency();

        const customerId = Number(params.customerId);

        return Response.json({
          customer: customersSeed.find(
            (customer) => customer.id === customerId,
          ),
          contacts: customerContactsSeed.filter(
            (contact) => contact.customerId === customerId,
          ),
          products: customerProductsSeed.filter(
            (product) => product.customerId === customerId,
          ),
        });
      },
    },
  },
});
