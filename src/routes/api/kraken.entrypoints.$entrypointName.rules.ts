import { createFileRoute } from "@tanstack/react-router";
import { getKrakenEntrypointRulesServer } from "@/features/kraken/kraken-server";

export const Route = createFileRoute(
  "/api/kraken/entrypoints/$entrypointName/rules",
)({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return Response.json(
          await getKrakenEntrypointRulesServer({
            data: { entrypointName: params.entrypointName },
          }),
        );
      },
    },
  },
});
