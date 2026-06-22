import {
  customerContactsSeed,
  customerProductsSeed,
  customersSeed,
  type CustomerProductDto,
} from "@/features/customers/data/customer-dtos";
import type {
  InsuranceCoverageDto,
  InsuranceRecordDto,
  InsuranceRecordKind as InsuranceRecordKindDto,
  InsuranceVehicleDto,
} from "@/features/insurance/services/insurance.types";

export type {
  InsuranceCoverageDto,
  InsurancePartyDto,
  InsuranceRecordDto,
  InsuranceRecordKind as InsuranceRecordKindDto,
  InsuranceVehicleDto,
} from "@/features/insurance/services/insurance.types";

const vehicleMakes = ["Toyota", "Honda", "Ford", "Subaru", "Mazda"];
const vehicleModels = ["RAV4", "Accord", "F-150", "Outback", "CX-5"];
const coverageNames = [
  "Bodily injury liability",
  "Property damage liability",
  "Comprehensive",
  "Collision",
  "Uninsured motorist",
];

export function getInsuranceRecordByBusinessKey(
  kind: InsuranceRecordKindDto,
  businessKey: string,
): InsuranceRecordDto | undefined {
  const product = customerProductsSeed.find(
    (item) =>
      item.referenceNumber === businessKey && item.type.toLowerCase() === kind,
  );

  if (!product) {
    return undefined;
  }

  return createInsuranceRecord(kind, product);
}

function createInsuranceRecord(
  kind: InsuranceRecordKindDto,
  product: CustomerProductDto,
): InsuranceRecordDto | undefined {
  const customer = customersSeed.find((item) => item.id === product.customerId);

  if (!customer) {
    return undefined;
  }

  const customerContacts = customerContactsSeed.filter(
    (contact) => contact.customerId === customer.id,
  );

  return {
    kind,
    businessKey: product.referenceNumber,
    productName: product.name,
    status: product.status,
    activity: product.activity,
    amount: product.amount,
    effectiveDate: product.effectiveDate,
    customerName: customer.name,
    parties: [
      {
        id: customer.id,
        role: "Customer",
        name: customer.name,
        email:
          customerContacts.find((contact) => contact.kind === "email")?.value ??
          "No email on file",
        phone:
          customerContacts.find((contact) => contact.kind === "phone")?.value ??
          "No phone on file",
        address:
          customerContacts.find((contact) => contact.kind === "address")
            ?.value ?? "No address on file",
      },
    ],
    vehicles: createVehicles(product),
    coverages: createCoverages(product),
  };
}

function createVehicles(product: CustomerProductDto): InsuranceVehicleDto[] {
  const count = (product.id % 2) + 1;

  return Array.from({ length: count }, (_, index) => {
    const seed = product.id + index;

    return {
      id: product.id * 10 + index + 1,
      year: 2020 + (seed % 6),
      make: vehicleMakes[seed % vehicleMakes.length],
      model: vehicleModels[seed % vehicleModels.length],
      vin: `VIN${String(product.id).padStart(6, "0")}${String(index + 1).padStart(3, "0")}`,
      garagingAddress: `Garage ${index + 1}`,
    };
  });
}

function createCoverages(product: CustomerProductDto): InsuranceCoverageDto[] {
  return coverageNames.map((name, index) => ({
    id: product.id * 10 + index + 1,
    name,
    limit:
      index < 2
        ? `$${((index + 1) * 100000).toLocaleString()}`
        : index === 4
          ? "$100,000 / $300,000"
          : "Actual cash value",
    deductible: index < 2 ? "$0" : `$${(500 + index * 250).toLocaleString()}`,
    premium: `$${(120 + product.id * 3 + index * 28).toLocaleString()}`,
  }));
}
