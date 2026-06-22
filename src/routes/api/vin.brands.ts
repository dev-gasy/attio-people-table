import { createFileRoute } from "@tanstack/react-router";
import { getVinBrandsServer } from "@/features/vin/vin-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/vin/brands")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return Response.json(await getVinBrandsServer());
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
