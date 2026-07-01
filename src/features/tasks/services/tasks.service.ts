import { fetchJson } from "@/shared/utils/fetch-json";
import type { TaskDto } from "./tasks.types";

type JsonClient = <TData>(path: string) => Promise<TData>;

export class TasksService {
  constructor(private readonly httpClient: JsonClient) {}

  getAll(): Promise<TaskDto[]> {
    return this.httpClient<TaskDto[]>("/api/tasks");
  }
}

export const tasksService = new TasksService(fetchJson);
