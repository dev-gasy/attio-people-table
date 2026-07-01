import { createFileRoute, redirect } from "@tanstack/react-router";
import { getStaticKrakenEntrypointsPayload } from "@/features/kraken/kraken-server";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/kraken_/$entrypointName")({
  beforeLoad: ({ params }) => {
    const entrypointName =
      getStaticKrakenEntrypointsPayload().find(
        (entrypoint) => entrypoint.slug === params.entrypointName,
      )?.name ?? params.entrypointName;

    throw redirect({
      to: "/kraken",
      search: { entrypoint: entrypointName },
    });
  },
  head: ({ params }) => {
    const entrypointName =
      getStaticKrakenEntrypointsPayload().find(
        (entrypoint) => entrypoint.slug === params.entrypointName,
      )?.name ?? params.entrypointName;

    return {
      meta: buildPageMeta({
        title: entrypointName,
        description: `Inspect Kraken rules for ${entrypointName} in CRM Demo.`,
      }),
    };
  },
  errorComponent: (props) => <RouteErrorFallback title="Kraken" {...props} />,
});
