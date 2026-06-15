import { queryOptions } from "@tanstack/react-query";
import type {
  InsuranceRecordDto,
  InsuranceRecordKindDto,
} from "@/features/insurance/insurance-dtos";
import { getInsuranceRecordServer } from "@/features/insurance/insurance-server";

export type InsuranceRecordResponseDto = {
  record: InsuranceRecordDto | undefined;
};

export const insuranceRecordQueryOptions = (
  kind: InsuranceRecordKindDto,
  businessKey: string,
) =>
  queryOptions({
    queryKey: [kind, businessKey],
    queryFn: () => getInsuranceRecord(kind, businessKey),
  });

export function getInsuranceRecord(
  kind: InsuranceRecordKindDto,
  businessKey: string,
) {
  return getInsuranceRecordServer({ data: { kind, businessKey } });
}
