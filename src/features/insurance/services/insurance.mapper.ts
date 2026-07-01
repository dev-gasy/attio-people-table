import type {
  InsuranceRecord,
  InsuranceRecordDto,
  InsuranceRecordResponse,
  InsuranceRecordResponseDto,
} from "./insurance.types";

export const insuranceMapper = {
  toModel(dto: InsuranceRecordDto): InsuranceRecord {
    return {
      ...dto,
      parties: dto.parties.map((party) => ({ ...party })),
      vehicles: dto.vehicles.map((vehicle) => ({ ...vehicle })),
      coverages: dto.coverages.map((coverage) => ({ ...coverage })),
    };
  },

  toResponseModel(dto: InsuranceRecordResponseDto): InsuranceRecordResponse {
    return {
      record: dto.record ? insuranceMapper.toModel(dto.record) : undefined,
    };
  },
};
