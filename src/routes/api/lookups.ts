import { lookupSeed } from "@/features/lookups/lookup-dtos";
import { simulateServiceResponse } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/lookups")({
  server: {
    handlers: {
      GET: async () => {
        const simulatedResponse = await simulateServiceResponse("lookupsList");

        if (simulatedResponse) return simulatedResponse;

        return Response.json(lookupSeed);
      },
    },
  },
});
