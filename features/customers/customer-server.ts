import { createServerFn } from "@tanstack/react-start";
import {
  customerContactsSeed,
  customerProductsSeed,
  customersSeed,
} from "@/features/customers/customer-dtos";
import { simulateServiceCall } from "@/features/shared/service-latency";

export const getCustomersServer = createServerFn({ method: "GET" }).handler(
  async () => {
    await simulateServiceCall("customersList");

    return {
      customers: customersSeed,
      contacts: customerContactsSeed,
      products: customerProductsSeed,
    };
  },
);

export const getCustomerServer = createServerFn({ method: "GET" })
  .validator((data: { customerId: number }) => data)
  .handler(async ({ data }) => {
    await simulateServiceCall("customerDetail");

    return {
      customer: customersSeed.find(
        (customer) => customer.id === data.customerId,
      ),
      contacts: customerContactsSeed.filter(
        (contact) => contact.customerId === data.customerId,
      ),
      products: customerProductsSeed.filter(
        (product) => product.customerId === data.customerId,
      ),
    };
  });
