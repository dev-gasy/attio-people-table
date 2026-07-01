import type { TaskDto } from "./services/tasks.types";

export const tasksSeed: TaskDto[] = [
  {
    id: 1,
    title: "Follow up with Vercel on renewal",
    done: false,
    assignee: "Julian Herbst",
    due: "Today",
    priority: "High",
  },
  {
    id: 2,
    title: "Send proposal to Notion",
    done: false,
    assignee: "Lena Cremers",
    due: "Tomorrow",
    priority: "High",
  },
  {
    id: 3,
    title: "Prep demo for Cursor",
    done: false,
    assignee: "Tom Holland",
    due: "Fri",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Review onboarding for Mercury",
    done: true,
    assignee: "Ana Gantt",
    due: "Yesterday",
    priority: "Medium",
  },
  {
    id: 5,
    title: "Reconnect with Loom",
    done: false,
    assignee: "Nicole Gold",
    due: "Next week",
    priority: "Low",
  },
  {
    id: 6,
    title: "Update CRM fields for Q3",
    done: true,
    assignee: "Leon Heinrichs",
    due: "Last week",
    priority: "Low",
  },
];
