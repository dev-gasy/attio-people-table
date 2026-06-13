export type ConnectionDto = "very-strong" | "strong" | "good" | "weak";

export type PersonDto = {
  id: number;
  name: string;
  hasPhoto?: boolean;
  email: string;
  connection: ConnectionDto;
  connectionWith: string;
  rating: number;
};

export type CreatePersonDto = {
  name: string;
  email?: string;
  connection: ConnectionDto;
  connectionWith?: string;
  rating: number;
};

export const peopleSeed: PersonDto[] = [
  { id: 1, name: "Nicolas Sharp", email: "nick@attio.com", connection: "very-strong", connectionWith: "Julian", rating: 4 },
  { id: 2, name: "Nicole Gold", hasPhoto: true, email: "n.gold@gmail.com", connection: "good", connectionWith: "Julian", rating: 4 },
  { id: 3, name: "Alex Christie", email: "alex@attio.com", connection: "very-strong", connectionWith: "Nicole", rating: 3 },
  { id: 4, name: "Nicolas Sharp", email: "nick.o@attio.com", connection: "strong", connectionWith: "Alex Vale", rating: 3 },
  { id: 5, name: "Nikki Meyers", hasPhoto: true, email: "nikki@attio.com", connection: "very-strong", connectionWith: "Julian", rating: 4 },
  { id: 6, name: "Julian Herbst", email: "julian@attio.com", connection: "very-strong", connectionWith: "Lena", rating: 4 },
  { id: 7, name: "Ana Gantt", email: "ana.g@googlemail.com", connection: "good", connectionWith: "Jonas", rating: 3 },
  { id: 8, name: "Lena Cremers", email: "lena.c@hotmail.com", connection: "strong", connectionWith: "Nick", rating: 4 },
  { id: 9, name: "Leon Heinrichs", email: "leon@attio.com", connection: "very-strong", connectionWith: "Niclas", rating: 4 },
  { id: 10, name: "Nicole Gold", hasPhoto: true, email: "nicole.gold@gmail.com", connection: "very-strong", connectionWith: "Niclas", rating: 3 },
  { id: 11, name: "Tom Holland", email: "tom@holland.co", connection: "very-strong", connectionWith: "Nick", rating: 2 },
  { id: 12, name: "Nikki Meyers", email: "nikki@attio.com", connection: "good", connectionWith: "Julian", rating: 3 },
  { id: 13, name: "Julian Herbst", email: "julian@jh.vision", connection: "weak", connectionWith: "Jarome", rating: 3 },
  { id: 14, name: "Ana Gantt", email: "ana.g@gmail.com", connection: "good", connectionWith: "James", rating: 4 },
  { id: 15, name: "Lena Cremers", email: "lena.c99@gmail.com", connection: "good", connectionWith: "James", rating: 4 },
  { id: 16, name: "Louis Lirou", email: "louli@gmail.com", connection: "good", connectionWith: "Julian", rating: 3 },
];
