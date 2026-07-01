import { queryOptions } from "@tanstack/react-query";
import { noteMapper } from "./notes.mapper";
import { notesService } from "./notes.service";

export const notesQueryOptions = {
  all: () => ["notes"] as const,

  list: () =>
    queryOptions({
      queryKey: notesQueryOptions.all(),
      queryFn: () => notesService.getAll(),
      select: noteMapper.toModels,
      staleTime: 1000 * 60 * 5,
    }),
};
