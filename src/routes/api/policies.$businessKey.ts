import { createFileRoute } from "@tanstack/react-router";
import { getInsuranceRecordServer } from "@/features/insurance/insurance-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/policies/$businessKey")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          return Response.json(
            await getInsuranceRecordServer({
              data: { kind: "policy", businessKey: params.businessKey },
            }),
          );
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
