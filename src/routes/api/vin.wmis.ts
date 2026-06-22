import { createFileRoute } from "@tanstack/react-router";
import { getVinWmisServer } from "@/features/vin/vin-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/vin/wmis")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);

        try {
          return Response.json(
            await getVinWmisServer({
              data: { brand: url.searchParams.get("brand") ?? undefined },
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
