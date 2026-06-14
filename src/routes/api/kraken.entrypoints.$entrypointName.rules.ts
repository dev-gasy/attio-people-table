import { createFileRoute } from "@tanstack/react-router";
import {
  entrypoints,
  rules,
} from "@/lib/workspace-data";
import { createSlug } from "@/features/shared/slugs";
import { waitForServiceLatency } from "@/features/shared/service-latency";

export const Route = createFileRoute(
  "/api/kraken/entrypoints/$entrypointName/rules",
)({
  server: {
    handlers: {
      GET: async ({ params }) => {
        await waitForServiceLatency();

        const entrypoint = entrypoints.find(
          (item) => createSlug(item.name) === params.entrypointName,
        );

        if (!entrypoint) {
          return Response.json(
            { message: "Entrypoint not found" },
            { status: 404 },
          );
        }

        const entrypointRules = rules.filter(
          (rule) => rule.entrypointId === entrypoint.id,
        );

        return Response.json({
          entrypoint: {
            ...entrypoint,
            slug: createSlug(entrypoint.name),
            rulesCount: entrypointRules.length,
          },
          rules: entrypointRules,
        });
      },
    },
  },
});
