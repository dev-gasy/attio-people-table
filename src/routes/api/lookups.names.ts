import { createFileRoute } from "@tanstack/react-router";
import { getLookupNamesServer } from "@/features/lookups/lookup-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/lookups/names")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return Response.json(await getLookupNamesServer());
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
