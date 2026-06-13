import {
  customerContactsSeed,
  customerProductsSeed,
  customersSeed,
} from "@/features/customers/dtos";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export const customersQueryOptions = () =>
  queryOptions({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });

export const customerQueryOptions = (customerId: number) =>
  queryOptions({
    queryKey: ["customers", customerId],
    queryFn: () => getCustomer({ data: customerId }),
  });

export const getCustomers = createServerFn({ method: "GET" }).handler(
  async () => ({
    customers: customersSeed,
    contacts: customerContactsSeed,
    products: customerProductsSeed,
  }),
);

export const getCustomer = createServerFn({ method: "GET" })
  .validator((customerId: number) => customerId)
  .handler(async ({ data: customerId }) => ({
    customer: customersSeed.find((customer) => customer.id === customerId),
    contacts: customerContactsSeed.filter(
      (contact) => contact.customerId === customerId,
    ),
    products: customerProductsSeed.filter(
      (product) => product.customerId === customerId,
    ),
  }));
