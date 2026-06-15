import type {
  CustomerContactDto,
  CustomerDto,
  CustomerProductDto,
} from "@/features/customers/customer-dtos";
import { queryOptions } from "@tanstack/react-query";
import {
  getCustomerServer,
  getCustomersServer,
} from "@/features/customers/customer-server";

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
  return getCustomersServer();
}

export function getCustomerById(customerId: number) {
  return getCustomerServer({ data: { customerId } });
}
