import { groupsSeed } from "@/features/groups/group-dtos";
import { waitForServiceLatency } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/groups")({
  server: {
    handlers: {
      GET: async () => {
        await waitForServiceLatency();
        return Response.json(groupsSeed);
      },
    },
  },
});
