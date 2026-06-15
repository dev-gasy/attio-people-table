import { createFileRoute } from "@tanstack/react-router";
import { getCustomersServer } from "@/features/customers/customer-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/customers")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return Response.json(await getCustomersServer());
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
