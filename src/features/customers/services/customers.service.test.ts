import { describe, expect, it, vi } from "vitest";
import { CustomersService } from "./customers.service";

describe("CustomersService", () => {
  it("fetches the customer list from the customers API route", async () => {
    const httpClient = vi.fn().mockResolvedValue({
      customers: [],
      contacts: [],
      products: [],
    });
    const service = new CustomersService(httpClient);

    await expect(service.getAll()).resolves.toEqual({
      customers: [],
      contacts: [],
      products: [],
    });

    expect(httpClient).toHaveBeenCalledWith("/api/customers");
  });

  it("fetches a customer detail payload by ID", async () => {
    const httpClient = vi.fn().mockResolvedValue({
      customer: undefined,
      contacts: [],
      products: [],
    });
    const service = new CustomersService(httpClient);

    await service.getById(42);

    expect(httpClient).toHaveBeenCalledWith("/api/customers/42");
  });
});
