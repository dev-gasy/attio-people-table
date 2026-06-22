import { useMemo, useState } from "react";
import { tasksSeed, type Task } from "@/features/tasks/tasks-data";

export type TaskFilter = "all" | "open" | "done";

export const taskFilters: TaskFilter[] = ["all", "open", "done"];

export function useTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(tasksSeed);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const visibleTasks = useMemo(
    () => filterTasks(tasks, filter),
    [filter, tasks],
  );
  const openCount = useMemo(
    () => tasks.filter((task) => !task.done).length,
    [tasks],
  );

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  return {
    filter,
    openCount,
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
