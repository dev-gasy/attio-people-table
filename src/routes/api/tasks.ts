import { createFileRoute } from "@tanstack/react-router";
import { getTasksServer } from "@/features/tasks/tasks-server";

export const Route = createFileRoute("/api/tasks")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(await getTasksServer());
      },
    },
  },
});
