import {
  getInsuranceRecordByBusinessKey,
  type InsuranceRecordDto,
} from "@/features/insurance/insurance-dtos";
import { waitForServiceLatency } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/quotes/$businessKey")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        await waitForServiceLatency();

        return Response.json({
          record: getInsuranceRecordByBusinessKey("quote", params.businessKey),
        } satisfies { record: InsuranceRecordDto | undefined });
      },
    },
  },
});
