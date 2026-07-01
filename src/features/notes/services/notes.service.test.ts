import { describe, expect, it, vi } from "vitest";
import { NotesService } from "./notes.service";

describe("NotesService", () => {
  it("fetches notes from the notes API route", async () => {
    const httpClient = vi.fn().mockResolvedValue([]);
    const service = new NotesService(httpClient);

    await expect(service.getAll()).resolves.toEqual([]);

    expect(httpClient).toHaveBeenCalledWith("/api/notes");
  });
});
