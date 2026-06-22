import { useMemo, useState } from "react";
import { notes } from "@/features/notes/notes-data";

export function useNotesPage() {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(normalizedQuery) ||
        note.excerpt.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return {
    query,
    rows,
    setQuery,
  };
}
