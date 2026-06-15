import { createFileRoute } from "@tanstack/react-router";
import { getInsuranceRecordServer } from "@/features/insurance/insurance-server";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/quotes/$businessKey")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          return Response.json(
            await getInsuranceRecordServer({
              data: { kind: "quote", businessKey: params.businessKey },
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
