export type TaskPriority = "High" | "Medium" | "Low";

export type TaskDto = {
  id: number;
  title: string;
  done: boolean;
  assignee: string;
  due: string;
  priority: TaskPriority;
};

export type Task = {
  id: number;
  title: string;
  done: boolean;
  assignee: string;
  initial: string;
  color: string;
  due: string;
  priority: TaskPriority;
};

export type TaskFilter = "all" | "open" | "done";
