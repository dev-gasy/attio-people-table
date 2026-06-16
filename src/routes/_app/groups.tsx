import { createFileRoute } from "@tanstack/react-router";
import { GroupsPage } from "@/features/groups/components/groups-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { groupsQueryOptions } from "@/features/groups/group-service";
import {
  shouldFetchGroups,
  type GroupsSearch,
} from "@/features/groups/use-groups-page";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/groups")({
  validateSearch: (search): GroupsSearch => ({
    province: typeof search.province === "string" ? search.province : undefined,
    search: typeof search.search === "string" ? search.search : undefined,
  }),
  loader: ({ context, search }) => {
    if (!shouldFetchGroups(search)) return;

    return context.queryClient.ensureQueryData(groupsQueryOptions(search));
  },
  head: () => ({
    meta: buildPageMeta({
      title: "Groups",
      description: "Browse company groups and account ownership in CRM Demo.",
    }),
  }),
  errorComponent: (props) => <RouteErrorFallback title="Groups" {...props} />,
  component: GroupsRoute,
});

function GroupsRoute() {
  const search = Route.useSearch();

  return <GroupsPage filters={search} />;
}
