import type { ConnectionDto, PersonDto } from "@/features/people/dtos";

export type Connection = ConnectionDto;

export type Person = {
  id: number;
  name: string;
  initial: string;
  avatarColor: string;
  hasPhoto?: boolean;
  email: string;
  connection: Connection;
  connectionWith: string;
  rating: number;
};

export const connectionStyles: Record<
  Connection,
  { label: string; type: "bolt" | "dot"; dotColor: string }
> = {
  "very-strong": { label: "Very strong", type: "bolt", dotColor: "" },
  strong: { label: "Strong", type: "bolt", dotColor: "" },
  good: { label: "Good", type: "dot", dotColor: "bg-emerald-500" },
  weak: { label: "Weak", type: "dot", dotColor: "bg-amber-500" },
};

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

const avatarColorById: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-pink-500",
  3: "bg-zinc-500",
  4: "bg-blue-500",
  5: "bg-rose-500",
  6: "bg-amber-500",
  7: "bg-emerald-500",
  8: "bg-pink-600",
  9: "bg-zinc-500",
  10: "bg-pink-500",
  11: "bg-zinc-500",
  12: "bg-orange-500",
  13: "bg-amber-500",
  14: "bg-red-500",
  15: "bg-pink-600",
  16: "bg-purple-500",
};

export function toPersonPresentation(dto: PersonDto): Person {
  return {
    ...dto,
    initial: dto.name[0]?.toUpperCase() ?? "?",
    avatarColor:
      avatarColorById[dto.id] ?? avatarColors[dto.id % avatarColors.length],
  };
}

export function toPeoplePresentation(dtos: PersonDto[]): Person[] {
  return dtos.map(toPersonPresentation);
}
