import { createFileRoute } from "@tanstack/react-router";
import { CompaniesPage } from "@/components/companies-page";

export const Route = createFileRoute("/_app/companies")({
  component: CompaniesRoute,
});

function CompaniesRoute() {
  return <CompaniesPage />;
}
