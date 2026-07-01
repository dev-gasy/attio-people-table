import { createFileRoute } from "@tanstack/react-router";
import { getLookupNamesServer } from "@/features/lookups/lookup-server";

export const Route = createFileRoute("/api/lookups/names")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(await getLookupNamesServer());
      },
    },
  },
});
