import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/features/notes/components/notes-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";
import { buildPageMeta } from "@/src/lib/page-meta";

export const Route = createFileRoute("/_app/notes")({
  head: () => ({
    meta: buildPageMeta({
      title: "Notes",
      description:
        "Review account notes and relationship context in Attio CRM.",
    }),
  }),
  errorComponent: (props) => <RouteErrorFallback title="Notes" {...props} />,
  component: NotesPage,
});
