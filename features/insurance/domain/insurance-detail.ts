import type {
  InsuranceCoverage,
  InsuranceParty,
  InsuranceRecord,
  InsuranceVehicle,
} from "@/features/insurance/services/insurance.types";

export type InsuranceField = {
  label: string;
  value: string;
};

export function getInsuranceSummaryFields(
  record: InsuranceRecord,
): InsuranceField[] {
  return [
    { label: "Business key", value: record.businessKey },
    { label: "Product", value: record.productName },
    { label: "Status", value: record.status },
    { label: "Activity", value: record.activity },
    { label: "Amount", value: record.amount },
    { label: "Effective", value: record.effectiveDate },
  ];
}

export function getPartyFields(party: InsuranceParty): InsuranceField[] {
  return [
    { label: "Role", value: party.role },
    { label: "Email", value: party.email },
    { label: "Phone", value: party.phone },
    { label: "Address", value: party.address },
  ];
}

export function getVehicleFields(vehicle: InsuranceVehicle): InsuranceField[] {
  return [
    { label: "Year", value: String(vehicle.year) },
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "VIN", value: vehicle.vin },
    { label: "Garaging", value: vehicle.garagingAddress },
  ];
}

export function getCoverageFields(
  coverage: InsuranceCoverage,
): InsuranceField[] {
  return [
    { label: "Limit", value: coverage.limit },
    { label: "Deductible", value: coverage.deductible },
    { label: "Premium", value: coverage.premium },
  ];
}
