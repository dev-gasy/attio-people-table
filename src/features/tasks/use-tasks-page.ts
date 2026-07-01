import { useMemo, useState } from "react";
import { useTasksQuery } from "./services/tasks.queries";
import type { Task, TaskFilter } from "./services/tasks.types";

export const taskFilters: TaskFilter[] = ["all", "open", "done"];

export function useTasksPage() {
  const query = useTasksQuery();
  const [taskOverrides, setTaskOverrides] = useState<Record<number, boolean>>(
    {},
  );
  const [filter, setFilter] = useState<TaskFilter>("all");
  const tasks = useMemo(() => {
    return (query.data ?? []).map((task) => ({
      ...task,
      done: taskOverrides[task.id] ?? task.done,
    }));
  }, [query.data, taskOverrides]);
  const visibleTasks = useMemo(
    () => filterTasks(tasks, filter),
    [filter, tasks],
  );
  const openCount = useMemo(
    () => tasks.filter((task) => !task.done).length,
    [tasks],
  );

  function toggleTask(id: number) {
    setTaskOverrides((prev) => {
      const task = tasks.find((item) => item.id === id);
      if (!task) return prev;

      return { ...prev, [id]: !task.done };
    });
  }

  return {
    error: query.error,
    filter,
    isError: query.isError,
    isLoading: query.isPending,
    isRetrying: query.isFetching && !query.isPending,
    openCount,
    refetch: query.refetch,
    setFilter,
    toggleTask,
    visibleTasks,
  };
}

function filterTasks(tasks: Task[], filter: TaskFilter) {
  switch (filter) {
    case "open":
      return tasks.filter((task) => !task.done);
    case "done":
      return tasks.filter((task) => task.done);
    default:
      return tasks;
  }
}
