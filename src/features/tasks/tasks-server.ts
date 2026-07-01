import { createServerFn } from "@tanstack/react-start";
import { tasksSeed } from "./tasks-data";

export const getTasksServer = createServerFn({ method: "GET" }).handler(
  async () => {
    return tasksSeed;
  },
);
