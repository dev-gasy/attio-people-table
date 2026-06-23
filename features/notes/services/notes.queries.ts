import { useQuery } from "@tanstack/react-query";
import { notesOptions } from "./notes.options";

export const useNotesQuery = () => useQuery(notesOptions.list());
