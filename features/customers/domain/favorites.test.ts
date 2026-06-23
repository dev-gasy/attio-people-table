import { describe, expect, it } from "vitest";
import {
  formatCustomerFavoriteIdsJson,
  normalizeCustomerFavoriteIds,
  parseCustomerFavoriteIdsJson,
  toggleCustomerFavoriteId,
} from "./favorites";

describe("customer favorites domain", () => {
  it("normalizes favorite IDs into a sorted unique integer list", () => {
    expect(normalizeCustomerFavoriteIds([3, 1, 3, 2.5, "4", Infinity])).toEqual(
      [1, 3],
    );
  });

  it("parses and formats favorites JSON", () => {
    expect(parseCustomerFavoriteIdsJson("[3, 1, 3]")).toEqual({
      ok: true,
      ids: [1, 3],
    });
    expect(parseCustomerFavoriteIdsJson('{"id":1}')).toEqual({
      ok: false,
      error: "Favorites JSON must be an array of IDs.",
    });
    expect(formatCustomerFavoriteIdsJson([2, 1, 2])).toBe("[\n  1,\n  2\n]\n");
  });

  it("toggles favorite IDs while preserving normalization", () => {
    expect(toggleCustomerFavoriteId(2, [3, 1])).toEqual([1, 2, 3]);
    expect(toggleCustomerFavoriteId(3, [3, 1])).toEqual([1]);
  });
});
