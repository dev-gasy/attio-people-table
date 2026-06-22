import { fetchJson } from "@/features/shared/fetch-json";
import type {
  KrakenEntrypointDto,
  KrakenEntrypointRulesResponseDto,
} from "./kraken.types";

type JsonClient = <TData>(path: string) => Promise<TData>;

export class KrakenService {
  constructor(private readonly httpClient: JsonClient) {}

  getEntrypoints(): Promise<KrakenEntrypointDto[]> {
    return this.httpClient<KrakenEntrypointDto[]>("/api/kraken/entrypoints");
  }

  getEntrypointRules(
    entrypointName: string,
  ): Promise<KrakenEntrypointRulesResponseDto> {
    return this.httpClient<KrakenEntrypointRulesResponseDto>(
      `/api/kraken/entrypoints/${encodeURIComponent(entrypointName)}/rules`,
    );
  }
}

export const krakenService = new KrakenService(fetchJson);
