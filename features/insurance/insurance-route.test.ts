import { describe, expect, it } from "vitest";
import {
  buildInsuranceTabSearch,
  parseQuoteRevisionParams,
  stringifyQuoteRevisionParams,
  validateInsuranceDetailSearch,
} from "./insurance-route";

describe("insurance route helpers", () => {
  it("falls back to the default tab for invalid search values", () => {
    expect(validateInsuranceDetailSearch({ tab: "unknown" })).toEqual({
      tab: "details",
    });
  });

  it("omits the default tab from search params", () => {
    expect(buildInsuranceTabSearch("details")).toEqual({ tab: undefined });
    expect(buildInsuranceTabSearch("vehicles")).toEqual({ tab: "vehicles" });
  });

  it("parses and stringifies quote revision route params", () => {
    expect(
      parseQuoteRevisionParams({
        businessKey: "QUO-001",
        revisionNumber: "3",
      }),
    ).toEqual({ businessKey: "QUO-001", revisionNumber: 3 });

    expect(
      stringifyQuoteRevisionParams({
        businessKey: "QUO-001",
        revisionNumber: 3,
      }),
    ).toEqual({ businessKey: "QUO-001", revisionNumber: "3" });
  });

  it("rejects invalid quote revisions", () => {
    expect(
      parseQuoteRevisionParams({
        businessKey: "QUO-001",
        revisionNumber: "latest",
      }),
    ).toBe(false);
  });
});
