import { faker } from "@faker-js/faker";
import { canadianProvinces } from "@/features/driving-licence/domain/provinces";

export type Gender = "Male" | "Female";

export type LicenceForm = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  province: string;
  gender: Gender;
  email: string;
};

export type LicenceResult = LicenceForm & {
  licenceNumber: string;
  generatedAt: string;
};

export const emptyLicenceForm: LicenceForm = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  province: "",
  gender: "Male",
  email: "",
};

export function canGenerateLicence(form: LicenceForm) {
  return Boolean(
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.dateOfBirth &&
    form.province &&
    form.gender &&
    form.email.trim(),
  );
}

export function normalizeLicenceForm(form: LicenceForm): LicenceForm {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    dateOfBirth: form.dateOfBirth,
    province: form.province,
    gender: form.gender,
    email: form.email.trim(),
  };
}

export function createRandomLicenceForm(): LicenceForm {
  const sex = faker.person.sexType();
  const gender: Gender = sex === "female" ? "Female" : "Male";
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    dateOfBirth: faker.date
      .birthdate({ min: 16, max: 85, mode: "age" })
      .toISOString()
      .slice(0, 10),
    province: faker.helpers.arrayElement(canadianProvinces),
    gender,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
  };
}

export function createLicenceResult(
  form: LicenceForm,
  generatedAt = new Date().toLocaleDateString("en-CA"),
): LicenceResult {
  const normalizedForm = normalizeLicenceForm(form);

  return {
    ...normalizedForm,
    licenceNumber: generateLicenceNumber(form),
    generatedAt,
  };
}

export function generateLicenceNumber(form: LicenceForm) {
  const source = `${form.firstName}|${form.lastName}|${form.dateOfBirth}|${form.province}|${form.email}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }

  return `SMP-${hash.toString(36).toUpperCase().padStart(8, "0").slice(0, 8)}`;
}
