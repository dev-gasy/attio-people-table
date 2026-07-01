import { describe, expect, it } from "vitest";
import { taskMapper } from "./tasks.mapper";
import type { TaskDto } from "./tasks.types";

describe("taskMapper", () => {
  it("derives presentation fields from task DTOs", () => {
    const dto: TaskDto = {
      id: 2,
      title: "Send proposal",
      done: false,
      assignee: "Lena Cremers",
      due: "Tomorrow",
      priority: "High",
    };

    expect(taskMapper.toModel(dto)).toEqual({
      ...dto,
      initial: "L",
      color: "bg-pink-600",
    });
  });

  it("uses a fallback initial for blank assignees", () => {
    expect(
      taskMapper.toModel({
        id: 99,
        title: "Unassigned",
        done: false,
        assignee: "",
        due: "Today",
        priority: "Low",
      }).initial,
    ).toBe("?");
  });
});
