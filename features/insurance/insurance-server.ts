import { createServerFn } from "@tanstack/react-start";
import {
  getInsuranceRecordByBusinessKey,
  type InsuranceRecordKindDto,
} from "@/features/insurance/insurance-dtos";
import { simulateServiceCall } from "@/features/shared/service-latency";

export const getInsuranceRecordServer = createServerFn({ method: "GET" })
  .validator(
    (data: { kind: InsuranceRecordKindDto; businessKey: string }) => data,
  )
  .handler(async ({ data }) => {
    await simulateServiceCall(
      data.kind === "policy" ? "policyDetail" : "quoteDetail",
    );

    return {
      record: getInsuranceRecordByBusinessKey(data.kind, data.businessKey),
    };
  });
