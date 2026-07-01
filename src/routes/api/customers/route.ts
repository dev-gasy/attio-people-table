import { createFileRoute } from "@tanstack/react-router";
import { getCustomersServer } from "@/features/customers/data/customer-server";

export const Route = createFileRoute("/api/customers")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(await getCustomersServer());
      },
    },
  },
});
