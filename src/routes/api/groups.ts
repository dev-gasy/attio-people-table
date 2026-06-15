import { createFileRoute } from "@tanstack/react-router";
import { getGroupsServer } from "@/features/groups/group-server";

export const Route = createFileRoute("/api/groups")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(await getGroupsServer());
      },
    },
  },
});
