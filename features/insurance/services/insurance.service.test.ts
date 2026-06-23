import { describe, expect, it, vi } from "vitest";
import { InsuranceService } from "./insurance.service";

describe("InsuranceService", () => {
  it("fetches policy records from the policies API route", async () => {
    const httpClient = vi.fn().mockResolvedValue({ record: undefined });
    const service = new InsuranceService(httpClient);

    await expect(
      service.getByBusinessKey("policy", "POL-001 234"),
    ).resolves.toEqual({ record: undefined });

    expect(httpClient).toHaveBeenCalledWith("/api/policies/POL-001%20234");
  });

  it("fetches quote records from the quotes API route", async () => {
    const httpClient = vi.fn().mockResolvedValue({ record: undefined });
    const service = new InsuranceService(httpClient);

    await service.getByBusinessKey("quote", "QUO-001");

    expect(httpClient).toHaveBeenCalledWith("/api/quotes/QUO-001");
  });
});
