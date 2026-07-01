import { createFileRoute } from "@tanstack/react-router";
import { getCustomerServer } from "@/features/customers/data/customer-server";

export const Route = createFileRoute("/api/customers/$customerId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return Response.json(
          await getCustomerServer({
            data: { customerId: Number(params.customerId) },
          }),
        );
      },
    },
  },
});
