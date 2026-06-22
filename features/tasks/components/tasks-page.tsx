import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyView } from "@/components/empty-view";
import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { taskFilters, useTasksPage } from "@/features/tasks/use-tasks-page";

export function TasksPage() {
  const { filter, openCount, setFilter, toggleTask, visibleTasks } =
    useTasksPage();

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
            {taskFilters.map((f) => (
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
      {visibleTasks.length === 0 ? (
        <PageFrameBody className="flex min-h-[calc(100vh-var(--page-frame-header-height))] items-center justify-center pb-8">
          <EmptyView message={`No ${filter} tasks`} />
        </PageFrameBody>
      ) : (
        <PageFrameBody className="pb-8">
          <div className="w-full divide-y divide-border/60 overflow-hidden rounded-xl border border-border">
            {visibleTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30"
              >
                <button
                  onClick={() => toggleTask(t.id)}
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
            ))}
          </div>
        </PageFrameBody>
      )}
    </PageFrame>
  );
}
