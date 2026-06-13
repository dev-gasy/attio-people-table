import { createFileRoute } from "@tanstack/react-router";
import { PeopleTable } from "@/components/people-table";
import { peopleQueryOptions } from "@/features/people/service";

export const Route = createFileRoute("/_app/people")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(peopleQueryOptions()),
  component: PeopleRoute,
});

function PeopleRoute() {
  return <PeopleTable />;
}
