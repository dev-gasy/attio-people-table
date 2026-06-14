import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/components/notes-page";

export const Route = createFileRoute("/_app/notes")({
  component: NotesPage,
});
