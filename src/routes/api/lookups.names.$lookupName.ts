import { createFileRoute } from "@tanstack/react-router";
import { lookupSeed } from "@/features/lookups/lookup-dtos";
import { createSlug } from "@/features/shared/slugs";
import { waitForServiceLatency } from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/lookups/names/$lookupName")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        await waitForServiceLatency();

        const lookupName = Array.from(
          new Set(lookupSeed.map((lookup) => lookup.lookupName)),
        ).find((name) => createSlug(name) === params.lookupName);

        if (!lookupName) {
          return Response.json(
            { message: "Lookup name not found" },
            { status: 404 },
          );
        }

        const lookups = lookupSeed.filter(
          (lookup) => lookup.lookupName === lookupName,
        );

        return Response.json({
          lookupName: {
            name: lookupName,
            slug: createSlug(lookupName),
            lookupsCount: lookups.length,
          },
          lookups,
        });
      },
    },
  },
});
