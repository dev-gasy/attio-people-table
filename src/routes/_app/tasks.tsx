import { createFileRoute } from "@tanstack/react-router";
import { TasksPage } from "@/features/tasks/components/tasks-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/tasks")({
  errorComponent: (props) => <RouteErrorFallback title="Tasks" {...props} />,
  component: TasksPage,
});
