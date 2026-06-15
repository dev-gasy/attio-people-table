import { createFileRoute } from "@tanstack/react-router";
import { getKrakenEntrypointRulesServer } from "@/features/kraken/kraken-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute(
  "/api/kraken/entrypoints/$entrypointName/rules",
)({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          return Response.json(
            await getKrakenEntrypointRulesServer({
              data: { entrypointName: params.entrypointName },
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
