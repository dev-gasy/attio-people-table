import { queryOptions } from "@tanstack/react-query";
import { insuranceMapper } from "./insurance.mapper";
import { insuranceService } from "./insurance.service";
import type { InsuranceRecordKind } from "./insurance.types";

export const insuranceOptions = {
  all: () => ["insurance"] as const,

  detail: (kind: InsuranceRecordKind, businessKey: string) =>
    queryOptions({
      queryKey: [...insuranceOptions.all(), kind, businessKey] as const,
      queryFn: () => insuranceService.getByBusinessKey(kind, businessKey),
      select: insuranceMapper.toResponseModel,
      staleTime: 1000 * 60 * 5,
    }),
};
