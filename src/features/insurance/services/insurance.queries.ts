import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { insuranceQueryOptions } from "./insurance.query-options";
import type { InsuranceRecordKind } from "./insurance.types";

export const useInsuranceRecordQuery = (
  kind: InsuranceRecordKind,
  businessKey: string,
) => useQuery(insuranceQueryOptions.detail(kind, businessKey));

export const useSuspenseInsuranceRecordQuery = (
  kind: InsuranceRecordKind,
  businessKey: string,
) => useSuspenseQuery(insuranceQueryOptions.detail(kind, businessKey));
