import { faker } from "@faker-js/faker";

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

const connectionSeeds = [
  "very-strong",
  "strong",
  "good",
  "weak",
] satisfies ConnectionDto[];

faker.seed(1001);

export const peopleSeed: PersonDto[] = Array.from(
  { length: 300 },
  (_, index) => {
    const name = faker.person.fullName();

    return {
      id: index + 1,
      name,
      hasPhoto: faker.datatype.boolean({ probability: 0.35 }),
      email: faker.internet
        .email({
          firstName: name.split(" ")[0],
          lastName: name.split(" ").at(-1),
        })
        .toLowerCase(),
      connection: faker.helpers.arrayElement(connectionSeeds),
      connectionWith: faker.person.firstName(),
      rating: faker.number.int({ min: 1, max: 4 }),
    };
  },
);
