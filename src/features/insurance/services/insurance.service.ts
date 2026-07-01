import { fetchJson } from "@/shared/utils/fetch-json";
import type {
  InsuranceRecordKind,
  InsuranceRecordResponseDto,
} from "./insurance.types";

type JsonClient = <TData>(path: string) => Promise<TData>;

export class InsuranceService {
  constructor(private readonly httpClient: JsonClient) {}

  getByBusinessKey(
    kind: InsuranceRecordKind,
    businessKey: string,
  ): Promise<InsuranceRecordResponseDto> {
    const resource = kind === "policy" ? "policies" : "quotes";
    return this.httpClient<InsuranceRecordResponseDto>(
      `/api/${resource}/${encodeURIComponent(businessKey)}`,
    );
  }
}

export const insuranceService = new InsuranceService(fetchJson);
