import {
  customerContactsSeed,
  customerProductsSeed,
  customersSeed,
} from "@/features/customers/customer-dtos";
import { simulateServiceResponse } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/customers")({
  server: {
    handlers: {
      GET: async () => {
        const simulatedResponse =
          await simulateServiceResponse("customersList");

        if (simulatedResponse) return simulatedResponse;

        return Response.json({
          customers: customersSeed,
          contacts: customerContactsSeed,
          products: customerProductsSeed,
        });
      },
    },
  },
});
