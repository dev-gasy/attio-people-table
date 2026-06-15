import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/features/notes/components/notes-page";
import { RouteErrorFallback } from "@/components/route-error-fallback";

export const Route = createFileRoute("/_app/notes")({
  errorComponent: (props) => <RouteErrorFallback title="Notes" {...props} />,
  component: NotesPage,
});
