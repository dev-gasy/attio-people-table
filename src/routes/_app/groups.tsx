import { createFileRoute } from "@tanstack/react-router";
import { GroupsPage } from "@/components/groups-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/groups")({
  errorComponent: (props) => <RouteErrorFallback title="Groups" {...props} />,
  component: GroupsRoute,
});

function GroupsRoute() {
  return <GroupsPage />;
}
