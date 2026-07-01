import { fetchJson } from "@/shared/utils/fetch-json";
import type {
  LookupDto,
  LookupNameDto,
  LookupNameResponseDto,
} from "./lookups.types";

type JsonClient = <TData>(path: string) => Promise<TData>;

export class LookupsService {
  constructor(private readonly httpClient: JsonClient) {}

  getAll(): Promise<LookupDto[]> {
    return this.httpClient<LookupDto[]>("/api/lookups");
  }

  getNames(): Promise<LookupNameDto[]> {
    return this.httpClient<LookupNameDto[]>("/api/lookups/names");
  }

  getByName(lookupName: string): Promise<LookupNameResponseDto> {
    return this.httpClient<LookupNameResponseDto>(
      `/api/lookups/names/${encodeURIComponent(lookupName)}`,
    );
  }
}

export const lookupsService = new LookupsService(fetchJson);
