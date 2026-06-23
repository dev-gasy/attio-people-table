import { describe, expect, it, vi } from "vitest";
import { TasksService } from "./tasks.service";

describe("TasksService", () => {
  it("fetches tasks from the tasks API route", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new TasksService(httpClient);

    await expect(service.getAll()).resolves.toEqual([]);

    expect(httpClient).toHaveBeenCalledWith("/api/tasks");
  });
});
