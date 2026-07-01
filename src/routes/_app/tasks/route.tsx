import { createFileRoute } from "@tanstack/react-router";
import { TasksPage } from "@/features/tasks/components/tasks-page";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({
    meta: buildPageMeta({
      title: "Tasks",
      description: "Track follow-ups and account tasks in CRM Demo.",
    }),
  }),
  errorComponent: (props) => <RouteErrorFallback title="Tasks" {...props} />,
  component: TasksPage,
});
