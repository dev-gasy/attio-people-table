import { createFileRoute } from "@tanstack/react-router";
import { getVinModelsServer } from "@/features/vin/vin-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/shared/utils/service-latency";

export const Route = createFileRoute("/api/vin/models")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);

        try {
          return Response.json(
            await getVinModelsServer({
              data: {
                brand: url.searchParams.get("brand") ?? undefined,
                year: url.searchParams.get("year") ?? undefined,
              },
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
