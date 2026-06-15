import { createFileRoute } from "@tanstack/react-router";
import { getGroupsServer } from "@/features/groups/group-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/groups")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return Response.json(await getGroupsServer());
        } catch (error) {
          if (error instanceof ServiceResponseError) {
            return serviceErrorResponse(error);
          }

          throw error;
        }
      },
    },
  },
});
