import { useQuery } from "@tanstack/react-query";
import { notesQueryOptions } from "./notes.query-options";

export const useNotesQuery = () => useQuery(notesQueryOptions.list());
