import { createFileRoute } from "@tanstack/react-router";
import { getGroupsServer } from "@/features/groups/group-server";

export const Route = createFileRoute("/api/groups")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);

        return Response.json(
          await getGroupsServer({
            data: {
              province: url.searchParams.get("province") ?? undefined,
              search: url.searchParams.get("search") ?? undefined,
            },
          }),
        );
      },
    },
  },
});
