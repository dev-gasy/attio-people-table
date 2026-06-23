import { queryOptions } from "@tanstack/react-query";
import { taskMapper } from "./tasks.mapper";
import { tasksService } from "./tasks.service";

export const tasksOptions = {
  all: () => ["tasks"] as const,

  list: () =>
    queryOptions({
      queryKey: tasksOptions.all(),
      queryFn: () => tasksService.getAll(),
      select: taskMapper.toModels,
      staleTime: 1000 * 60 * 5,
    }),
};
