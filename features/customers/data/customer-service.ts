import { queryOptions } from "@tanstack/react-query";
import {
  getCustomerServer,
  getCustomersServer,
} from "@/features/customers/data/customer-server";
import {
  mapCustomerDtoToCustomer,
  mapCustomerDtosToCustomers,
  type Customer,
} from "@/features/customers/data/customer-mappers";

export type CustomersResponse = Customer[];
export type CustomerResponse = Customer | undefined;

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
  return getCustomersServer().then(({ customers, contacts, products }) =>
    mapCustomerDtosToCustomers(customers, contacts, products),
  );
}

export async function getCustomerById(
  customerId: number,
): Promise<Customer | undefined> {
  const { customer, contacts, products } = await getCustomerServer({
    data: { customerId },
  });

  return customer
    ? mapCustomerDtoToCustomer(customer, contacts, products)
    : undefined;
}
