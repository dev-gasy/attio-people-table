export type Connection = "very-strong" | "strong" | "good" | "weak"

export type Person = {
  id: number
  name: string
  initial: string
  avatarColor: string
  hasPhoto?: boolean
  email: string
  connection: Connection
  connectionWith: string
  rating: number
}

export const connectionStyles: Record<
  Connection,
  { label: string; type: "bolt" | "dot"; dotColor: string }
> = {
  "very-strong": { label: "Very strong", type: "bolt", dotColor: "" },
  strong: { label: "Strong", type: "bolt", dotColor: "" },
  good: { label: "Good", type: "dot", dotColor: "bg-emerald-500" },
  weak: { label: "Weak", type: "dot", dotColor: "bg-amber-500" },
}

export const people: Person[] = [
  { id: 1, name: "Nicolas Sharp", initial: "N", avatarColor: "bg-blue-500", email: "nick@attio.com", connection: "very-strong", connectionWith: "Julian", rating: 4 },
  { id: 2, name: "Nicole Gold", initial: "N", avatarColor: "bg-pink-500", hasPhoto: true, email: "n.gold@gmail.com", connection: "good", connectionWith: "Julian", rating: 4 },
  { id: 3, name: "Alex Christie", initial: "A", avatarColor: "bg-zinc-500", email: "alex@attio.com", connection: "very-strong", connectionWith: "Nicole", rating: 3 },
  { id: 4, name: "Nicolas Sharp", initial: "N", avatarColor: "bg-blue-500", email: "nick.o@attio.com", connection: "strong", connectionWith: "Alex Vale", rating: 3 },
  { id: 5, name: "Nikki Meyers", initial: "N", avatarColor: "bg-rose-500", hasPhoto: true, email: "nikki@attio.com", connection: "very-strong", connectionWith: "Julian", rating: 4 },
  { id: 6, name: "Julian Herbst", initial: "J", avatarColor: "bg-amber-500", email: "julian@attio.com", connection: "very-strong", connectionWith: "Lena", rating: 4 },
  { id: 7, name: "Ana Gantt", initial: "A", avatarColor: "bg-emerald-500", email: "ana.g@googlemail.com", connection: "good", connectionWith: "Jonas", rating: 3 },
  { id: 8, name: "Lena Cremers", initial: "L", avatarColor: "bg-pink-600", email: "lena.c@hotmail.com", connection: "strong", connectionWith: "Nick", rating: 4 },
  { id: 9, name: "Leon Heinrichs", initial: "L", avatarColor: "bg-zinc-500", email: "leon@attio.com", connection: "very-strong", connectionWith: "Niclas", rating: 4 },
  { id: 10, name: "Nicole Gold", initial: "N", avatarColor: "bg-pink-500", hasPhoto: true, email: "nicole.gold@gmail.com", connection: "very-strong", connectionWith: "Niclas", rating: 3 },
  { id: 11, name: "Tom Holland", initial: "T", avatarColor: "bg-zinc-500", email: "tom@holland.co", connection: "very-strong", connectionWith: "Nick", rating: 2 },
  { id: 12, name: "Nikki Meyers", initial: "N", avatarColor: "bg-orange-500", email: "nikki@attio.com", connection: "good", connectionWith: "Julian", rating: 3 },
  { id: 13, name: "Julian Herbst", initial: "J", avatarColor: "bg-amber-500", email: "julian@jh.vision", connection: "weak", connectionWith: "Jarome", rating: 3 },
  { id: 14, name: "Ana Gantt", initial: "A", avatarColor: "bg-red-500", email: "ana.g@gmail.com", connection: "good", connectionWith: "James", rating: 4 },
  { id: 15, name: "Lena Cremers", initial: "L", avatarColor: "bg-pink-600", email: "lena.c99@gmail.com", connection: "good", connectionWith: "James", rating: 4 },
  { id: 16, name: "Louis Lirou", initial: "L", avatarColor: "bg-purple-500", email: "louli@gmail.com", connection: "good", connectionWith: "Julian", rating: 3 },
]
