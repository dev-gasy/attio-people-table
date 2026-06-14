import { createFileRoute, notFound } from "@tanstack/react-router";
import { lookupNamesQueryOptions } from "@/features/lookups/lookup-service";
import {
  LookupsPage,
  LookupsPageLoading,
} from "@/components/lookups/lookups-page";
import { PageHeader } from "@/components/page-header";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/lookups_/$lookupName")({
  loader: async ({ context, params }) => {
    const lookupNames = await context.queryClient.ensureQueryData(
      lookupNamesQueryOptions(),
    );

    if (
      !lookupNames.some((lookupName) => lookupName.slug === params.lookupName)
    ) {
      throw notFound();
    }
  },
  pendingComponent: LookupsPageLoading,
  notFoundComponent: LookupNameNotFound,
  errorComponent: (props) => <RouteErrorFallback title="Lookups" {...props} />,
  component: LookupsRoute,
});

function LookupsRoute() {
  const { lookupName } = Route.useParams();

  return <LookupsPage lookupName={lookupName} />;
}

function LookupNameNotFound() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader title="Lookups" />
      <div className="px-6 py-10 text-sm text-muted-foreground">
        Lookup name not found
      </div>
    </div>
  );
}
