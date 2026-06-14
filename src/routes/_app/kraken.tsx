import { createFileRoute } from "@tanstack/react-router";
import {
  KrakenPage,
  KrakenPageLoading,
} from "@/components/kraken/kraken-page";
import { krakenEntrypointsQueryOptions } from "@/features/kraken/kraken-service";

export const Route = createFileRoute("/_app/kraken")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      krakenEntrypointsQueryOptions(),
    );
  },
  pendingComponent: KrakenPageLoading,
  component: KrakenPage,
});
