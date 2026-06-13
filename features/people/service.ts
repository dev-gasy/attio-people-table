import {
  peopleSeed,
  type CreatePersonDto,
  type PersonDto,
} from "@/features/people/dtos";

export function getPeople(): PersonDto[] {
  return peopleSeed;
}

export function createPerson(input: CreatePersonDto, people: PersonDto[]): PersonDto {
  const id = Math.max(0, ...people.map((person) => person.id)) + 1;

  return {
    id,
    name: input.name.trim(),
    email: input.email?.trim() || "unknown@attio.com",
    connection: input.connection,
    connectionWith: input.connectionWith?.trim() || "Team",
    rating: input.rating,
  };
}
