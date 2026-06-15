import { createServerFn } from "@tanstack/react-start";
import { entrypoints, rules } from "@/lib/workspace-data";
import { createSlug } from "@/features/shared/slugs";
import {
  ServiceResponseError,
  simulateServiceCall,
} from "@/features/shared/service-latency";

export const getKrakenEntrypointsServer = createServerFn({
  method: "GET",
}).handler(async () => {
  await simulateServiceCall("krakenEntrypointsList");

  return getStaticKrakenEntrypointsPayload();
});

export const getKrakenEntrypointRulesServer = createServerFn({ method: "GET" })
  .validator((data: { entrypointName: string }) => data)
  .handler(async ({ data }) => {
    await simulateServiceCall("krakenEntrypointRules");

    const entrypoint = entrypoints.find(
      (item) => createSlug(item.name) === data.entrypointName,
    );

    if (!entrypoint) {
      throw new ServiceResponseError({
        message: "Entrypoint not found",
        status: 404,
        statusText: "Not Found",
      });
    }

    const entrypointRules = rules.filter(
      (rule) => rule.entrypointId === entrypoint.id,
    );

    return {
      entrypoint: {
        ...entrypoint,
        slug: createSlug(entrypoint.name),
        rulesCount: entrypointRules.length,
      },
      rules: entrypointRules,
    };
  });

export function getStaticKrakenEntrypointsPayload() {
  return entrypoints.map((entrypoint) => ({
    ...entrypoint,
    slug: createSlug(entrypoint.name),
    rulesCount: rules.filter((rule) => rule.entrypointId === entrypoint.id)
      .length,
  }));
}
