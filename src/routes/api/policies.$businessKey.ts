import { createFileRoute } from "@tanstack/react-router";
import { getInsuranceRecordServer } from "@/features/insurance/insurance-server";

export const Route = createFileRoute("/api/policies/$businessKey")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return Response.json(
          await getInsuranceRecordServer({
            data: { kind: "policy", businessKey: params.businessKey },
          }),
        );
      },
    },
  },
});
