import { createFileRoute } from "@tanstack/react-router";
import { getInsuranceRecordServer } from "@/features/insurance/insurance-server";

export const Route = createFileRoute("/api/quotes/$businessKey")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return Response.json(
          await getInsuranceRecordServer({
            data: { kind: "quote", businessKey: params.businessKey },
          }),
        );
      },
    },
  },
});
