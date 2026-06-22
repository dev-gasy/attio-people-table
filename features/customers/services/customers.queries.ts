import { useQuery } from "@tanstack/react-query";
import { customersOptions } from "./customers.options";

export const useCustomersQuery = (enabled = true) =>
  useQuery({ ...customersOptions.list(), enabled });

export const useCustomerQuery = (customerId: number, enabled = true) =>
  useQuery({ ...customersOptions.detail(customerId), enabled });
