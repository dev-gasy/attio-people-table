import { createServerFn } from "@tanstack/react-start";
import {
  getInsuranceRecordByBusinessKey,
  type InsuranceRecordKindDto,
} from "@/features/insurance/insurance-dtos";
import { createServiceSimulationMiddleware } from "@/features/shared/service-latency";

export const getInsuranceRecordServer = createServerFn({ method: "GET" })
  .middleware([
    createServiceSimulationMiddleware((data) => {
      const input = data as {
        kind: InsuranceRecordKindDto;
        businessKey: string;
      };

      return input.kind === "policy" ? "policyDetail" : "quoteDetail";
    }),
  ])
  .validator(
    (data: { kind: InsuranceRecordKindDto; businessKey: string }) => data,
  )
  .handler(async ({ data }) => {
    return {
      record: getInsuranceRecordByBusinessKey(data.kind, data.businessKey),
    };
  });
