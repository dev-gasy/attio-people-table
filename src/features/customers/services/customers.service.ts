import { fetchJson } from "@/shared/utils/fetch-json";
import type {
  CustomerResponseDto,
  CustomersResponseDto,
} from "./customers.types";

type JsonClient = <TData>(path: string) => Promise<TData>;

export class CustomersService {
  constructor(private readonly httpClient: JsonClient) {}

  getAll(): Promise<CustomersResponseDto> {
    return this.httpClient<CustomersResponseDto>("/api/customers");
  }

  getById(customerId: number): Promise<CustomerResponseDto> {
    return this.httpClient<CustomerResponseDto>(`/api/customers/${customerId}`);
  }
}

export const customersService = new CustomersService(fetchJson);
