import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { tasksSeed, type Task } from "@/lib/workspace-data";

type Filter = "all" | "open" | "done";

const FILTERS: Filter[] = ["all", "open", "done"];

function filterTasks(tasks: Task[], filter: Filter) {
  switch (filter) {
    case "open":
      return tasks.filter((t) => !t.done);
    case "done":
      return tasks.filter((t) => t.done);
    default:
      return tasks;
  }
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(tasksSeed);
  const [filter, setFilter] = useState<Filter>("all");

  const toggle = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const visible = filterTasks(tasks, filter);
  const openCount = tasks.filter((t) => !t.done).length;

  return (
    <PageFrame>
      <PageHeader
        title="Tasks"
        badge={
          <span className="ml-2 rounded-md bg-primary/15 px-2.5 py-1 text-sm text-primary">
            {openCount} open
          </span>
        }
        actions={
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-3 py-1 text-sm capitalize",
                  filter === f
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />
      <PageFrameBody className="pb-8">
        <div className="w-full divide-y divide-border/60 overflow-hidden rounded-xl border border-border">
          {visible.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              No {filter} tasks
            </p>
          ) : (
            visible.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30"
              >
                <button
                  onClick={() => toggle(t.id)}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    t.done
                      ? "border-primary bg-primary text-white"
                      : "border-border hover:border-foreground",
                  )}
                  aria-label={t.done ? "Mark incomplete" : "Mark complete"}
                >
                  {t.done && <Check className="h-3.5 w-3.5" />}
                </button>
                <span
                  className={cn(
                    "flex-1 text-sm",
                    t.done
                      ? "text-muted-foreground line-through"
                      : "text-foreground",
                  )}
                >
                  {t.title}
                </span>
              </div>
            ))
          )}
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}
