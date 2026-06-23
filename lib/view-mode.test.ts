import { describe, expect, it } from "vitest";
import { DEFAULT_VIEW_MODE, parseViewMode } from "./view-mode";

describe("view mode", () => {
  it("accepts supported view modes", () => {
    expect(parseViewMode("grid")).toBe("grid");
    expect(parseViewMode("list")).toBe("list");
  });

  it("falls back to the default view mode", () => {
    expect(parseViewMode("table")).toBe(DEFAULT_VIEW_MODE);
    expect(parseViewMode(undefined)).toBe(DEFAULT_VIEW_MODE);
  });
});
