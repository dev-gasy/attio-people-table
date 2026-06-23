import { fetchJson } from "@/features/shared/fetch-json";
import type { NoteDto } from "./notes.types";

type JsonClient = <TData>(path: string) => Promise<TData>;

export class NotesService {
  constructor(private readonly httpClient: JsonClient) {}

  getAll(): Promise<NoteDto[]> {
    return this.httpClient<NoteDto[]>("/api/notes");
  }
}

export const notesService = new NotesService(fetchJson);
