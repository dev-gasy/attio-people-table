import { createFileRoute } from "@tanstack/react-router";
import { PeopleTable } from "@/components/people-table";

export const Route = createFileRoute("/_app/people")({
  component: PeopleRoute,
});

function PeopleRoute() {
  return <PeopleTable />;
}
