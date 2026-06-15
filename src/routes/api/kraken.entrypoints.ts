import { createFileRoute } from "@tanstack/react-router";
import { getKrakenEntrypointsServer } from "@/features/kraken/kraken-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/kraken/entrypoints")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return Response.json(await getKrakenEntrypointsServer());
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
