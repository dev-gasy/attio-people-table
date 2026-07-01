import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchJson } from "./fetch-json";

describe("fetchJson", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed JSON for successful responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    await expect(fetchJson("/api/example")).resolves.toEqual({ ok: true });

    expect(fetch).toHaveBeenCalledWith("/api/example");
  });

  it("throws a useful error for non-OK responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Missing", { status: 404, statusText: "Not Found" }),
    );

    await expect(fetchJson("/api/missing")).rejects.toThrow(
      "Request failed: 404 Not Found",
    );
  });
});
