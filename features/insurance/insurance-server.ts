import { createServerFn } from "@tanstack/react-start";
import {
  getInsuranceRecordByBusinessKey,
  type InsuranceRecordKindDto,
} from "@/features/insurance/insurance-dtos";

export const getInsuranceRecordServer = createServerFn({ method: "GET" })
  .validator(
    (data: { kind: InsuranceRecordKindDto; businessKey: string }) => data,
  )
  .handler(async ({ data }) => {
    return {
      record: getInsuranceRecordByBusinessKey(data.kind, data.businessKey),
    };
  });
