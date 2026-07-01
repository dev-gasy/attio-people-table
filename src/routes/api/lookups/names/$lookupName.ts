import { createFileRoute } from "@tanstack/react-router";
import { getLookupNameServer } from "@/features/lookups/lookup-server";

export const Route = createFileRoute("/api/lookups/names/$lookupName")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return Response.json(
          await getLookupNameServer({
            data: { lookupName: params.lookupName },
          }),
        );
      },
    },
  },
});
