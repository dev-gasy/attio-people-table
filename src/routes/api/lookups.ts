import { lookupSeed } from "@/features/lookups/lookup-dtos";
import { waitForServiceLatency } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/lookups")({
  server: {
    handlers: {
      GET: async () => {
        await waitForServiceLatency();
        return Response.json(lookupSeed);
      },
    },
  },
});
