import { describe, expect, it } from "vitest";
import { noteMapper } from "./notes.mapper";
import type { NoteDto } from "./notes.types";

describe("noteMapper", () => {
  it("derives presentation fields from note DTOs", () => {
    const dto: NoteDto = {
      id: 1,
      title: "Renewal call",
      excerpt: "Budget approved.",
      author: "Julian Herbst",
      updated: "2m ago",
    };

    expect(noteMapper.toModel(dto)).toEqual({
      ...dto,
      initial: "J",
      color: "bg-amber-500",
    });
  });

  it("uses a fallback initial for blank authors", () => {
    expect(
      noteMapper.toModel({
        id: 99,
        title: "Untitled",
        excerpt: "",
        author: "",
        updated: "Now",
      }).initial,
    ).toBe("?");
  });
});
