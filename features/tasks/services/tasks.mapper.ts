import type { Task, TaskDto } from "./tasks.types";

const taskColors = [
  "bg-amber-500",
  "bg-pink-600",
  "bg-zinc-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-blue-500",
];

export const taskMapper = {
  toModel(dto: TaskDto): Task {
    return {
      ...dto,
      initial: dto.assignee.trim().charAt(0).toUpperCase() || "?",
      color: taskColors[(dto.id - 1) % taskColors.length] ?? "bg-zinc-500",
    };
  },

  toModels(dtos: TaskDto[]): Task[] {
    return dtos.map(taskMapper.toModel);
  },
};
