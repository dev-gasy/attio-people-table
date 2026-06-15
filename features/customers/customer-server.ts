import { createServerFn } from "@tanstack/react-start";
import {
  customerContactsSeed,
  customerProductsSeed,
  customersSeed,
} from "@/features/customers/customer-dtos";
import { createServiceSimulationMiddleware } from "@/features/shared/service-latency";

export const getCustomersServer = createServerFn({ method: "GET" })
  .middleware([createServiceSimulationMiddleware("customersList")])
  .handler(async () => {
    return {
      customers: customersSeed,
      contacts: customerContactsSeed,
      products: customerProductsSeed,
    };
  });

export const getCustomerServer = createServerFn({ method: "GET" })
  .middleware([createServiceSimulationMiddleware("customerDetail")])
  .validator((data: { customerId: number }) => data)
  .handler(async ({ data }) => {
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
