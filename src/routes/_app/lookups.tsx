import { createFileRoute } from "@tanstack/react-router";
import { LookupsPage } from "@/components/lookups/lookups-page";

export const Route = createFileRoute("/_app/lookups")({
  component: LookupsPage,
});
