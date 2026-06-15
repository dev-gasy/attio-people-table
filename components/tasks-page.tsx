import { useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { tasksSeed, type Task } from "@/lib/workspace-data";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(tasksSeed);
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  function toggle(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  const visible = useMemo(() => {
    if (filter === "open") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

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
          <>
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
              {(["all", "open", "done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-3 py-1 text-sm capitalize ${
                    filter === f
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </>
        }
      />
      <PageFrameBody className="pb-8">
        <div className="w-full divide-y divide-border/60 overflow-hidden rounded-xl border border-border">
          {visible.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30"
            >
              <button
                onClick={() => toggle(t.id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  t.done
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-border hover:border-foreground"
                }`}
                aria-label={t.done ? "Mark incomplete" : "Mark complete"}
              >
                {t.done && <Check className="h-3.5 w-3.5" />}
              </button>
              <span
                className={`flex-1 text-sm ${
                  t.done
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {t.title}
              </span>
            </div>
          ))}
          {visible.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No {filter} tasks
            </div>
          )}
        </div>
      </PageFrameBody>
    </PageFrame>
  );
}
