import { createFileRoute } from "@tanstack/react-router";
import { getNotesServer } from "@/features/notes/notes-server";

export const Route = createFileRoute("/api/notes")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(await getNotesServer());
      },
    },
  },
});
