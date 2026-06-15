import { createFileRoute } from "@tanstack/react-router";
import { getKrakenEntrypointsServer } from "@/features/kraken/kraken-server";

export const Route = createFileRoute("/api/kraken/entrypoints")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(await getKrakenEntrypointsServer());
      },
    },
  },
});
