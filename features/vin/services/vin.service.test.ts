import { describe, expect, it, vi } from "vitest";
import { VinService } from "./vin.service";

describe("VIN service", () => {
  it("fetches brands from the VIN API route", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new VinService(httpClient);

    await expect(service.getBrands()).resolves.toEqual([]);

    expect(httpClient).toHaveBeenCalledWith("/api/vin/brands");
  });

  it("fetches models with brand and year query params", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new VinService(httpClient);

    await service.getModels({ brand: "BMW", year: "2024" });

    expect(httpClient).toHaveBeenCalledWith(
      "/api/vin/models?brand=BMW&year=2024",
    );
  });

  it("fetches WMIs with the brand query param", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new VinService(httpClient);

    await service.getWmis("Mercedes-Benz");

    expect(httpClient).toHaveBeenCalledWith(
      "/api/vin/wmis?brand=Mercedes-Benz",
    );
  });
});
