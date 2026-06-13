import { fetchJson } from "@/features/shared/fetch-json";
import type { CreatePersonDto, PersonDto } from "@/features/people/person-dtos";
import { queryOptions } from "@tanstack/react-query";

export const peopleQueryOptions = () =>
  queryOptions({
    queryKey: ["people"],
    queryFn: () => getPeople(),
  });

export function getPeople() {
  return fetchJson<PersonDto[]>("/api/people");
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
