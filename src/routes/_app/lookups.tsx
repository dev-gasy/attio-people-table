import { createFileRoute } from "@tanstack/react-router";
import {
  LookupsPage,
  LookupsPageLoading,
} from "@/components/lookups/lookups-page";
import { lookupNamesQueryOptions } from "@/features/lookups/lookup-service";

export const Route = createFileRoute("/_app/lookups")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      lookupNamesQueryOptions(),
    );
  },
  pendingComponent: LookupsPageLoading,
  component: LookupsPage,
});
