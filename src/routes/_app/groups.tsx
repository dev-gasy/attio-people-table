import { createFileRoute } from "@tanstack/react-router";
import { GroupsPage } from "@/features/groups/components/groups-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { groupsQueryOptions } from "@/features/groups/group-service";

export const Route = createFileRoute("/_app/groups")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(groupsQueryOptions()),
  errorComponent: (props) => <RouteErrorFallback title="Groups" {...props} />,
  component: GroupsRoute,
});

function GroupsRoute() {
  return <GroupsPage />;
}
