import { createServerFn } from "@tanstack/react-start";
import { notesSeed } from "./notes-data";

export const getNotesServer = createServerFn({ method: "GET" }).handler(
  async () => {
    return notesSeed;
  },
);
