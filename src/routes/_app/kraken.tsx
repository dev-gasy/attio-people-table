import { createFileRoute } from "@tanstack/react-router";
import { KrakenPage } from "@/components/kraken/kraken-page";

export const Route = createFileRoute("/_app/kraken")({
  component: KrakenPage,
});
