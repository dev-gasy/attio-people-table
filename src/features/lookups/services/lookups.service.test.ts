import { describe, expect, it, vi } from "vitest";
import { LookupsService } from "./lookups.service";

describe("LookupsService", () => {
  it("fetches all lookup rows from the lookups API route", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new LookupsService(httpClient);

    await expect(service.getAll()).resolves.toEqual([]);

    expect(httpClient).toHaveBeenCalledWith("/api/lookups");
  });

  it("fetches lookup names from the names API route", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new LookupsService(httpClient);

    await service.getNames();

    expect(httpClient).toHaveBeenCalledWith("/api/lookups/names");
  });

  it("fetches lookup details by encoded lookup name", async () => {
    const httpClient = vi.fn().mockResolvedValue({
      lookupName: {
        name: "Policy status",
        slug: "policy-status",
        lookupsCount: 0,
      },
      lookups: [],
    });
    const service = new LookupsService(httpClient);

    await service.getByName("policy status");

    expect(httpClient).toHaveBeenCalledWith(
      "/api/lookups/names/policy%20status",
    );
  });
});
