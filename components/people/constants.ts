import type { Connection } from "@/lib/people-data";

export const PEOPLE_PAGE_SIZE = 8;

export const connectionOptions = [
  { value: "very-strong", label: "Very strong" },
  { value: "strong", label: "Strong" },
  { value: "good", label: "Good" },
  { value: "weak", label: "Weak" },
];

export const avatarColors = [
  "bg-blue-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-sky-500",
];

export const emptyPersonForm = {
  name: "",
  email: "",
  connection: "good" as Connection,
  connectionWith: "",
  rating: 3,
};

export type PersonForm = typeof emptyPersonForm;

