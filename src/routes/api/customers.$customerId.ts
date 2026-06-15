import { createFileRoute } from "@tanstack/react-router";
import { getCustomerServer } from "@/features/customers/customer-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/customers/$customerId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          return Response.json(
            await getCustomerServer({
              data: { customerId: Number(params.customerId) },
            }),
          );
        } catch (error) {
          if (error instanceof ServiceResponseError) {
            return serviceErrorResponse(error);
          }

          throw error;
        }
      },
    },
  },
});
