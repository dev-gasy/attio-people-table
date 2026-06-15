import { createFileRoute } from "@tanstack/react-router";
import { getLookupNameServer } from "@/features/lookups/lookup-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/lookups/names/$lookupName")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          return Response.json(
            await getLookupNameServer({
              data: { lookupName: params.lookupName },
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
