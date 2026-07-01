import type { Note, NoteDto } from "./notes.types";

const noteColors = [
  "bg-amber-500",
  "bg-zinc-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-pink-600",
  "bg-purple-500",
];

export const noteMapper = {
  toModel(dto: NoteDto): Note {
    return {
      ...dto,
      initial: dto.author.trim().charAt(0).toUpperCase() || "?",
      color: noteColors[(dto.id - 1) % noteColors.length] ?? "bg-zinc-500",
    };
  },

  toModels(dtos: NoteDto[]): Note[] {
    return dtos.map(noteMapper.toModel);
  },
};
