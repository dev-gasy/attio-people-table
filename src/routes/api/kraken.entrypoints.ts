import { createFileRoute } from "@tanstack/react-router";
import { entrypoints, rules } from "@/lib/workspace-data";
import { createSlug } from "@/features/shared/slugs";
import { simulateServiceResponse } from "@/features/shared/service-latency";

export const Route = createFileRoute("/api/kraken/entrypoints")({
  server: {
    handlers: {
      GET: async () => {
        const simulatedResponse = await simulateServiceResponse(
          "krakenEntrypointsList",
        );

        if (simulatedResponse) return simulatedResponse;

        return Response.json(
          entrypoints.map((entrypoint) => ({
            ...entrypoint,
            slug: createSlug(entrypoint.name),
            rulesCount: rules.filter(
              (rule) => rule.entrypointId === entrypoint.id,
            ).length,
          })),
        );
      },
    },
  },
});
