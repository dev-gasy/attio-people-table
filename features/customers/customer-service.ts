import { fetchJson } from "@/features/shared/fetch-json";
import type {
  CustomerContactDto,
  CustomerDto,
  CustomerProductDto,
} from "@/features/customers/customer-dtos";
import { queryOptions } from "@tanstack/react-query";

export type CustomersResponseDto = {
  customers: CustomerDto[];
  contacts: CustomerContactDto[];
  products: CustomerProductDto[];
};

export type CustomerResponseDto = {
  customer: CustomerDto | undefined;
  contacts: CustomerContactDto[];
  products: CustomerProductDto[];
};

export const customersQueryOptions = () =>
  queryOptions({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });

export const customerQueryOptions = (customerId: number) =>
  queryOptions({
    queryKey: ["customers", customerId],
    queryFn: () => getCustomerById(customerId),
  });

export function getCustomers() {
  return fetchJson<CustomersResponseDto>("/api/customers");
}

export function getCustomerById(customerId: number) {
  return fetchJson<CustomerResponseDto>(`/api/customers/${customerId}`);
}
