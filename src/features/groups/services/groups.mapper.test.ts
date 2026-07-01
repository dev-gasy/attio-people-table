import { describe, expect, it } from "vitest";
import { groupMapper } from "./groups.mapper";
import type { GroupDto } from "./groups.types";

describe("groupMapper", () => {
  it("derives presentation fields from group DTOs", () => {
    const dto: GroupDto = {
      id: 1,
      organization: "Acme Mutual",
      groupShortNameFr: "Acme FR",
      groupShortNameEn: "Acme",
      onlineIdentifier: "ACM",
      province: "ON",
    };

    expect(groupMapper.toModel(dto)).toEqual({
      ...dto,
      initial: "A",
      color: "bg-indigo-500",
      provinceLabel: "Ontario",
    });
  });

  it("uses deterministic fallbacks for missing presentation metadata", () => {
    const model = groupMapper.toModel({
      id: 99,
      organization: "",
      groupShortNameFr: "Unknown FR",
      groupShortNameEn: "Unknown",
      onlineIdentifier: "UNK",
      province: "YT",
    });

    expect(model.initial).toBe("?");
    expect(model.color).toBe("bg-sky-500");
    expect(model.provinceLabel).toBe("Yukon");
  });
});
