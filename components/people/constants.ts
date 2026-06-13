import type { Connection } from "@/features/people/person-mappers";
import { avatarColors, connectionOptions } from "@/features/people/person-mappers";

export const PEOPLE_PAGE_SIZE = 8;
export { avatarColors, connectionOptions };

export const emptyPersonForm = {
  name: "",
  email: "",
  connection: "good" as Connection,
  connectionWith: "",
  rating: 3,
};

export type PersonForm = typeof emptyPersonForm;
