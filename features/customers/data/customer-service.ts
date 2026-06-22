import { queryOptions } from "@tanstack/react-query";
import {
  type CustomerContactDto,
  type CustomerDto,
  type CustomerProductDto,
} from "@/features/customers/data/customer-dtos";
import {
  mapCustomerDtoToCustomer,
  mapCustomerDtosToCustomers,
  type Customer,
} from "@/features/customers/data/customer-mappers";
import { fetchJson } from "@/features/shared/fetch-json";

export type CustomersResponse = Customer[];
export type CustomerResponse = Customer | undefined;

type CustomersApiResponse = {
  customers: CustomerDto[];
  contacts: CustomerContactDto[];
  products: CustomerProductDto[];
};

type CustomerApiResponse = {
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
  return fetchJson<CustomersApiResponse>("/api/customers").then(
    ({ customers, contacts, products }) =>
      mapCustomerDtosToCustomers(customers, contacts, products),
  );
}

export async function getCustomerById(
  customerId: number,
): Promise<Customer | undefined> {
  const { customer, contacts, products } = await fetchJson<CustomerApiResponse>(
    `/api/customers/${customerId}`,
  );

  return customer
    ? mapCustomerDtoToCustomer(customer, contacts, products)
    : undefined;
}
