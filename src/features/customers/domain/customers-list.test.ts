import { describe, expect, it } from "vitest";
import {
  hasCustomerSearchValue,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "./customers-list";

const emptySearch: CustomerSearchValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  policyQuoteNumber: "",
  email: "",
  phone: "",
  address: "",
};

describe("customer search domain", () => {
  it("trims search values before storing them", () => {
    expect(
      trimCustomerSearchValues({
        ...emptySearch,
        firstName: " Ada ",
        policyQuoteNumber: " POL-001 ",
      }),
    ).toEqual({
      ...emptySearch,
      firstName: "Ada",
      policyQuoteNumber: "POL-001",
    });
  });

  it("detects meaningful search values after trimming", () => {
    expect(hasCustomerSearchValue({ ...emptySearch, email: "   " })).toBe(
      false,
    );
    expect(
      hasCustomerSearchValue({ ...emptySearch, email: "a@example.com" }),
    ).toBe(true);
  });
});
