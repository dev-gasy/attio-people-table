import {
  getInsuranceRecordByBusinessKey,
  type InsuranceRecordDto,
} from "@/features/insurance/insurance-dtos";
import { simulateServiceResponse } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/policies/$businessKey")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const simulatedResponse = await simulateServiceResponse("policyDetail");

        if (simulatedResponse) return simulatedResponse;

        return Response.json({
          record: getInsuranceRecordByBusinessKey("policy", params.businessKey),
        } satisfies { record: InsuranceRecordDto | undefined });
      },
    },
  },
});
