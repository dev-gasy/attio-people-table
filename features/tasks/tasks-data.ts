export type Task = {
  id: number;
  title: string;
  done: boolean;
  assignee: string;
  initial: string;
  color: string;
  due: string;
  priority: "High" | "Medium" | "Low";
};

export const tasksSeed: Task[] = [
  {
    id: 1,
    title: "Follow up with Vercel on renewal",
    done: false,
    assignee: "Julian Herbst",
    initial: "J",
    color: "bg-amber-500",
    due: "Today",
    priority: "High",
  },
  {
    id: 2,
    title: "Send proposal to Notion",
    done: false,
    assignee: "Lena Cremers",
    initial: "L",
    color: "bg-pink-600",
    due: "Tomorrow",
    priority: "High",
  },
  {
    id: 3,
    title: "Prep demo for Cursor",
    done: false,
    assignee: "Tom Holland",
    initial: "T",
    color: "bg-zinc-500",
    due: "Fri",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Review onboarding for Mercury",
    done: true,
    assignee: "Ana Gantt",
    initial: "A",
    color: "bg-emerald-500",
    due: "Yesterday",
    priority: "Medium",
  },
  {
    id: 5,
    title: "Reconnect with Loom",
    done: false,
    assignee: "Nicole Gold",
    initial: "N",
    color: "bg-pink-500",
    due: "Next week",
    priority: "Low",
  },
  {
    id: 6,
    title: "Update CRM fields for Q3",
    done: true,
    assignee: "Leon Heinrichs",
    initial: "L",
    color: "bg-blue-500",
    due: "Last week",
    priority: "Low",
  },
];
