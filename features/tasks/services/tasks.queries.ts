import { useQuery } from "@tanstack/react-query";
import { tasksOptions } from "./tasks.options";

export const useTasksQuery = () => useQuery(tasksOptions.list());
