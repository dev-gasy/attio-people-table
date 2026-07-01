import { describe, expect, it } from "vitest";
import { insuranceMapper } from "./insurance.mapper";
import type { InsuranceRecordDto } from "./insurance.types";

const policyDto: InsuranceRecordDto = {
  kind: "policy",
  businessKey: "POL-001",
  productName: "Auto",
  status: "Active",
  activity: "Bound",
  amount: "$1,200",
  effectiveDate: "2026-01-01",
  customerName: "Ada Lovelace",
  parties: [
    {
      id: 1,
      role: "Customer",
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "555-0101",
      address: "1 Main St",
    },
  ],
  vehicles: [
    {
      id: 10,
      year: 2024,
      make: "Honda",
      model: "Civic",
      vin: "1HGCM82633A004352",
      garagingAddress: "1 Main St",
    },
  ],
  coverages: [
    {
      id: 20,
      name: "Liability",
      limit: "$1,000,000",
      deductible: "$500",
      premium: "$100",
    },
  ],
};

describe("insuranceMapper", () => {
  it("maps record DTOs into cloned UI models", () => {
    const model = insuranceMapper.toModel(policyDto);

    expect(model).toEqual(policyDto);
    expect(model).not.toBe(policyDto);
    expect(model.parties[0]).not.toBe(policyDto.parties[0]);
    expect(model.vehicles[0]).not.toBe(policyDto.vehicles[0]);
    expect(model.coverages[0]).not.toBe(policyDto.coverages[0]);
  });

  it("wraps missing records without manufacturing a model", () => {
    expect(insuranceMapper.toResponseModel({ record: undefined })).toEqual({
      record: undefined,
    });
  });
});
