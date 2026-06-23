import { describe, expect, it } from "vitest";
import { customerMapper } from "./customers.mapper";
import type {
  CustomerContactDto,
  CustomerDto,
  CustomerProductDto,
} from "./customers.types";

const customerDto: CustomerDto = {
  id: 42,
  firstName: "",
  lastName: "",
  name: "Example Customer",
  dateOfBirth: "1980-01-01",
  status: "Active",
  segment: "Retail",
  owner: "Agent",
  location: "Toronto",
  since: "2020",
  summary: "Summary",
  lifetimeValue: "$10,000",
  risk: "Low",
};

const contacts: CustomerContactDto[] = [
  {
    id: 1,
    customerId: 42,
    kind: "email",
    label: "Work",
    value: "customer@example.com",
    preferred: true,
  },
  {
    id: 2,
    customerId: 7,
    kind: "phone",
    label: "Mobile",
    value: "555-0102",
    preferred: true,
  },
];

const products: CustomerProductDto[] = [
  {
    id: 10,
    customerId: 42,
    type: "Policy",
    referenceNumber: "POL-001",
    businessDimension: "Personal lines",
    activity: "Active",
    name: "Auto",
    status: "Active",
    amount: "$100",
    effectiveDate: "2026-01-01",
  },
  {
    id: 11,
    customerId: 7,
    type: "Quote",
    referenceNumber: "QUO-001",
    businessDimension: "Pipeline",
    activity: "Inactive",
    name: "Home",
    status: "Draft",
    amount: "$50",
    effectiveDate: "2026-02-01",
  },
];

describe("customerMapper", () => {
  it("derives presentation fields and keeps related records only", () => {
    const model = customerMapper.toModel(customerDto, contacts, products);

    expect(model.initial).toBe("EX");
    expect(model.color).toBe("bg-blue-500");
    expect(model.contacts).toEqual([contacts[0]]);
    expect(model.products).toEqual([products[0]]);
  });

  it("returns undefined for missing detail records", () => {
    expect(
      customerMapper.toDetailModel({
        customer: undefined,
        contacts,
        products,
      }),
    ).toBeUndefined();
  });
});
