export type InsuranceRecordKind = "policy" | "quote";

export type InsurancePartyDto = {
  id: number;
  role: "Customer";
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type InsuranceVehicleDto = {
  id: number;
  year: number;
  make: string;
  model: string;
  vin: string;
  garagingAddress: string;
};

export type InsuranceCoverageDto = {
  id: number;
  name: string;
  limit: string;
  deductible: string;
  premium: string;
};

export type InsuranceRecordDto = {
  kind: InsuranceRecordKind;
  businessKey: string;
  productName: string;
  status: string;
  activity: string;
  amount: string;
  effectiveDate: string;
  customerName: string;
  parties: InsurancePartyDto[];
  vehicles: InsuranceVehicleDto[];
  coverages: InsuranceCoverageDto[];
};

export type InsuranceParty = {
  id: number;
  role: "Customer";
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type InsuranceVehicle = {
  id: number;
  year: number;
  make: string;
  model: string;
  vin: string;
  garagingAddress: string;
};

export type InsuranceCoverage = {
  id: number;
  name: string;
  limit: string;
  deductible: string;
  premium: string;
};

export type InsuranceRecord = {
  kind: InsuranceRecordKind;
  businessKey: string;
  productName: string;
  status: string;
  activity: string;
  amount: string;
  effectiveDate: string;
  customerName: string;
  parties: InsuranceParty[];
  vehicles: InsuranceVehicle[];
  coverages: InsuranceCoverage[];
};

export type InsuranceRecordResponseDto = {
  record: InsuranceRecordDto | undefined;
};
export type InsuranceRecordResponse = { record: InsuranceRecord | undefined };
