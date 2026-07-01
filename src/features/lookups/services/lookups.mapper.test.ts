import { describe, expect, it } from "vitest";
import { lookupMapper } from "./lookups.mapper";
import type { LookupDto, LookupNameResponseDto } from "./lookups.types";

const lookupDto: LookupDto = {
  id: 12,
  lookupName: "Policy status",
  code: "ACTIVE",
  orderNo: 1,
  displayValueEn: "Active",
  displayValueFr: "Active",
  effectiveDate: "2026-01-15T00:00:00.000Z",
};

describe("lookupMapper", () => {
  it("formats effective dates while preserving the raw value", () => {
    expect(lookupMapper.toModel(lookupDto)).toEqual({
      ...lookupDto,
      effectiveDate: "Jan 15, 2026",
      effectiveDateValue: "2026-01-15T00:00:00.000Z",
    });
  });

  it("maps detail responses into lookup models", () => {
    const response: LookupNameResponseDto = {
      lookupName: {
        name: "Policy status",
        slug: "policy-status",
        lookupsCount: 1,
      },
      lookups: [lookupDto],
    };

    const model = lookupMapper.toDetailModel(response);

    expect(model.lookupName).toBe(response.lookupName);
    expect(model.lookups).toEqual([lookupMapper.toModel(lookupDto)]);
  });
});
