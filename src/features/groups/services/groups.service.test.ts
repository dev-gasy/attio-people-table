import { describe, expect, it, vi } from "vitest";
import { GroupsService } from "./groups.service";

describe("GroupsService", () => {
  it("fetches all groups without query params when filters are empty", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new GroupsService(httpClient);

    await expect(service.getAll({})).resolves.toEqual([]);

    expect(httpClient).toHaveBeenCalledWith("/api/groups");
  });

  it("trims and sends supported filters as query params", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new GroupsService(httpClient);

    await service.getAll({ province: " ON ", search: " abc " });

    expect(httpClient).toHaveBeenCalledWith(
      "/api/groups?province=ON&search=abc",
    );
  });

  it("does not send short search terms", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new GroupsService(httpClient);

    await service.getAll({ search: "ab" });

    expect(httpClient).toHaveBeenCalledWith("/api/groups");
  });
});
