import { describe, expect, it } from "vitest";

import {
  calculateVinCheckDigit,
  normalizeVin,
  validateVin,
} from "./vin.service";

describe("VIN service", () => {
  it("normalizes whitespace, separators, and casing", () => {
    expect(normalizeVin(" 1hg-cm8263 3a004352 ")).toBe(
      "1HGCM82633A004352",
    );
  });

  it("validates a VIN with a matching check digit", () => {
    const result = validateVin("1HGCM82633A004352");

    expect(result).toMatchObject({
      actualCheckDigit: "3",
      expectedCheckDigit: "3",
      isValid: true,
      normalizedVin: "1HGCM82633A004352",
      status: "valid",
    });
    expect(result.errors).toEqual([]);
  });

  it("calculates X when the VIN check digit remainder is 10", () => {
    expect(calculateVinCheckDigit("1M8GDM9AXKP042788")).toBe("X");
  });
});
