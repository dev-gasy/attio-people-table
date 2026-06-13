import { createFileRoute } from "@tanstack/react-router";
import { CompaniesPage } from "@/components/companies-page";
import { companiesQueryOptions } from "@/features/companies/company-service";

export const Route = createFileRoute("/_app/companies")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(companiesQueryOptions()),
  component: CompaniesRoute,
});

function CompaniesRoute() {
  return <CompaniesPage />;
}
