import { groupsSeed } from "@/features/groups/group-dtos";
import { simulateServiceResponse } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/groups")({
  server: {
    handlers: {
      GET: async () => {
        const simulatedResponse = await simulateServiceResponse("groupsList");

        if (simulatedResponse) return simulatedResponse;

        return Response.json(groupsSeed);
      },
    },
  },
});
