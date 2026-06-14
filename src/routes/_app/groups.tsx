import { createFileRoute } from "@tanstack/react-router";
import { GroupsPage } from "@/components/groups-page";

export const Route = createFileRoute("/_app/groups")({
  component: GroupsRoute,
});

function GroupsRoute() {
  return <GroupsPage />;
}
