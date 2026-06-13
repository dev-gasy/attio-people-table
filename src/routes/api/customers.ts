import {
  customerContactsSeed,
  customerProductsSeed,
  customersSeed,
} from "@/features/customers/customer-dtos";
import { waitForServiceLatency } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/customers")({
  server: {
    handlers: {
      GET: async () => {
        await waitForServiceLatency();

        return Response.json({
          customers: customersSeed,
          contacts: customerContactsSeed,
          products: customerProductsSeed,
        });
      },
    },
  },
});
