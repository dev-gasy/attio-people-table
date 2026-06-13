import { peopleSeed } from "@/features/people/person-dtos";
import { waitForServiceLatency } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/people")({
  server: {
    handlers: {
      GET: async () => {
        await waitForServiceLatency();
        return Response.json(peopleSeed);
      },
    },
  },
});
