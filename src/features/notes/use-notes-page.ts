import { useMemo, useState } from "react";
import { useNotesQuery } from "./services/notes.queries";

export function useNotesPage() {
  const notesQuery = useNotesQuery();
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return (notesQuery.data ?? []).filter(
      (note) =>
        note.title.toLowerCase().includes(normalizedQuery) ||
        note.excerpt.toLowerCase().includes(normalizedQuery),
    );
  }, [notesQuery.data, query]);

  return {
    error: notesQuery.error,
    isError: notesQuery.isError,
    isLoading: notesQuery.isPending,
    isRetrying: notesQuery.isFetching && !notesQuery.isPending,
    query,
    refetch: notesQuery.refetch,
    rows,
    setQuery,
  };
}
