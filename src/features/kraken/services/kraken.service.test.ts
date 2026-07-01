import { describe, expect, it, vi } from "vitest";
import { KrakenService } from "./kraken.service";

describe("KrakenService", () => {
  it("fetches entrypoints from the Kraken API route", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new KrakenService(httpClient);

    await expect(service.getEntrypoints()).resolves.toEqual([]);

    expect(httpClient).toHaveBeenCalledWith("/api/kraken/entrypoints");
  });

  it("fetches rules for an encoded entrypoint name", async () => {
    const httpClient = vi.fn().mockResolvedValue({
      entrypoint: {
        id: 1,
        name: "Policy quote",
        slug: "policy-quote",
        rulesCount: 0,
      },
      rules: [],
    });
    const service = new KrakenService(httpClient);

    await service.getEntrypointRules("policy quote");

    expect(httpClient).toHaveBeenCalledWith(
      "/api/kraken/entrypoints/policy%20quote/rules",
    );
  });
});
