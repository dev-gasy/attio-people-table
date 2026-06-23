import { queryOptions } from "@tanstack/react-query";
import { noteMapper } from "./notes.mapper";
import { notesService } from "./notes.service";

export const notesOptions = {
  all: () => ["notes"] as const,

  list: () =>
    queryOptions({
      queryKey: notesOptions.all(),
      queryFn: () => notesService.getAll(),
      select: noteMapper.toModels,
      staleTime: 1000 * 60 * 5,
    }),
};
