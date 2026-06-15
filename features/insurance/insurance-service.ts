import { queryOptions } from "@tanstack/react-query";
import type { InsuranceRecordKindDto } from "@/features/insurance/insurance-dtos";
import { getInsuranceRecordServer } from "@/features/insurance/insurance-server";
import {
  mapInsuranceRecordDtoToRecord,
  type InsuranceRecord,
} from "@/features/insurance/insurance-mappers";

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
  return getInsuranceRecordServer({ data: { kind, businessKey } }).then(
    ({ record }) => ({
      record: record ? mapInsuranceRecordDtoToRecord(record) : undefined,
    }),
  );
}
