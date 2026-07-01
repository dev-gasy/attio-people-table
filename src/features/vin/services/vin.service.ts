import { fetchJson } from "@/shared/utils/fetch-json";
import type { VinBrandDto, VinModelDto, VinWmiDto } from "./vin.types";

type JsonClient = <TData>(path: string) => Promise<TData>;

export class VinService {
  constructor(private readonly httpClient: JsonClient) {}

  getBrands(): Promise<VinBrandDto[]> {
    return this.httpClient<VinBrandDto[]>("/api/vin/brands");
  }

  getModels({
    brand,
    year,
  }: {
    brand: string;
    year: number | string;
  }): Promise<VinModelDto[]> {
    const params = new URLSearchParams({
      brand,
      year: String(year),
    });
    return this.httpClient<VinModelDto[]>(`/api/vin/models?${params}`);
  }

  getWmis(brand: string): Promise<VinWmiDto[]> {
    const params = new URLSearchParams({ brand });
    return this.httpClient<VinWmiDto[]>(`/api/vin/wmis?${params}`);
  }
}

export const vinService = new VinService(fetchJson);
