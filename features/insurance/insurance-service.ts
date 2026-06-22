import { queryOptions } from "@tanstack/react-query";
import type {
  InsuranceRecordDto,
  InsuranceRecordKindDto,
} from "@/features/insurance/insurance-dtos";
import {
  mapInsuranceRecordDtoToRecord,
  type InsuranceRecord,
} from "@/features/insurance/insurance-mappers";
import { fetchJson } from "@/features/shared/fetch-json";

export type InsuranceRecordResponse = {
  record: InsuranceRecord | undefined;
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
  return fetchJson<{ record: InsuranceRecordDto | undefined }>(
    `/api/${kind === "policy" ? "policies" : "quotes"}/${encodeURIComponent(
      businessKey,
    )}`,
  ).then(({ record }) => ({
    record: record ? mapInsuranceRecordDtoToRecord(record) : undefined,
  }));
}
