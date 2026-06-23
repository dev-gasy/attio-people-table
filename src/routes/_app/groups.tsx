import { createFileRoute } from "@tanstack/react-router";
import { GroupsPage } from "@/features/groups/components/groups-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { type GroupsSearch } from "@/features/groups/use-groups-page";
import { buildPageMeta } from "@/src/lib/page-meta";
import { parseViewMode } from "@/lib/view-mode";

export const Route = createFileRoute("/_app/groups")({
  validateSearch: (search): GroupsSearch => ({
    province: typeof search.province === "string" ? search.province : undefined,
    search: typeof search.search === "string" ? search.search : undefined,
    view: parseViewMode(search.view),
  }),
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
