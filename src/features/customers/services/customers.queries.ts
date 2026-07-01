import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { customersQueryOptions } from "./customers.query-options";

export const useCustomersQuery = (enabled = true) =>
  useQuery({ ...customersQueryOptions.list(), enabled });

export const useCustomerQuery = (customerId: number, enabled = true) =>
  useQuery({ ...customersQueryOptions.detail(customerId), enabled });

export const useSuspenseCustomerQuery = (customerId: number) =>
  useSuspenseQuery(customersQueryOptions.detail(customerId));
