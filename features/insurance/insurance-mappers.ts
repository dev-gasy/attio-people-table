import type {
  InsuranceCoverageDto,
  InsurancePartyDto,
  InsuranceRecordDto,
  InsuranceRecordKindDto,
  InsuranceVehicleDto,
} from "@/features/insurance/insurance-dtos";

export type InsuranceRecordKind = InsuranceRecordKindDto;
export type InsuranceParty = InsurancePartyDto;
export type InsuranceVehicle = InsuranceVehicleDto;
export type InsuranceCoverage = InsuranceCoverageDto;
export type InsuranceRecord = InsuranceRecordDto;

export function mapInsuranceRecordDtoToRecord(
  dto: InsuranceRecordDto,
): InsuranceRecord {
  return dto;
}
