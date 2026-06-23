import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { insuranceOptions } from "./insurance.options";
import type { InsuranceRecordKind } from "./insurance.types";

export const useInsuranceRecordQuery = (
  kind: InsuranceRecordKind,
  businessKey: string,
) => useQuery(insuranceOptions.detail(kind, businessKey));

export const useSuspenseInsuranceRecordQuery = (
  kind: InsuranceRecordKind,
  businessKey: string,
) => useSuspenseQuery(insuranceOptions.detail(kind, businessKey));
