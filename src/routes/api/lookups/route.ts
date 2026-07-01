import { createFileRoute } from "@tanstack/react-router";
import { getLookupsServer } from "@/features/lookups/lookup-server";

export const Route = createFileRoute("/api/lookups")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(await getLookupsServer());
      },
    },
  },
});
