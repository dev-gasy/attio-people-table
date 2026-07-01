import { useQuery } from "@tanstack/react-query";
import { tasksQueryOptions } from "./tasks.query-options";

export const useTasksQuery = () => useQuery(tasksQueryOptions.list());
