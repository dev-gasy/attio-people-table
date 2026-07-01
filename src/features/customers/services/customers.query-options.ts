import { queryOptions } from "@tanstack/react-query";
import { customerMapper } from "./customers.mapper";
import { customersService } from "./customers.service";

export const customersQueryOptions = {
  all: () => ["customers"] as const,

  list: () =>
    queryOptions({
      queryKey: customersQueryOptions.all(),
      queryFn: () => customersService.getAll(),
      select: customerMapper.toModels,
      staleTime: 1000 * 60 * 5,
    }),

  detail: (customerId: number) =>
    queryOptions({
      queryKey: [...customersQueryOptions.all(), "detail", customerId] as const,
      queryFn: () => customersService.getById(customerId),
      select: customerMapper.toDetailModel,
      staleTime: 1000 * 60 * 5,
    }),
};
