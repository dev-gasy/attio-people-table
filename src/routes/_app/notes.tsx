import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/features/notes/components/notes-page";
import { RouteErrorFallback } from "@/shared/components/route-error-fallback";
import { buildPageMeta } from "@/shared/utils/page-meta";

export const Route = createFileRoute("/_app/notes")({
  head: () => ({
    meta: buildPageMeta({
      title: "Notes",
      description: "Review account notes and relationship context in CRM Demo.",
    }),
  }),
  errorComponent: (props) => <RouteErrorFallback title="Notes" {...props} />,
  component: NotesPage,
});
