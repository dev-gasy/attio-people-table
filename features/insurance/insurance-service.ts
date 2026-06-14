import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "@/features/shared/fetch-json";
import type {
  InsuranceRecordDto,
  InsuranceRecordKindDto,
} from "@/features/insurance/insurance-dtos";

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
  const collection = kind === "policy" ? "policies" : "quotes";

  return fetchJson<InsuranceRecordResponseDto>(
    `/api/${collection}/${businessKey}`,
  );
}
