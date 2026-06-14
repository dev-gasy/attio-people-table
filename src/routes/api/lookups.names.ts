import { createFileRoute } from "@tanstack/react-router";
import { lookupSeed } from "@/features/lookups/lookup-dtos";
import { createSlug } from "@/features/shared/slugs";
import { simulateServiceResponse } from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/lookups/names")({
  server: {
    handlers: {
      GET: async () => {
        const simulatedResponse =
          await simulateServiceResponse("lookupNamesList");

        if (simulatedResponse) return simulatedResponse;

        const lookupNames = Array.from(
          new Set(lookupSeed.map((lookup) => lookup.lookupName)),
        );

        return Response.json(
          lookupNames.map((lookupName) => ({
            name: lookupName,
            slug: createSlug(lookupName),
            lookupsCount: lookupSeed.filter(
              (lookup) => lookup.lookupName === lookupName,
            ).length,
          })),
        );
      },
    },
  },
});
