import { faker } from "@faker-js/faker";
import { z } from "zod";
import { canadianProvinces } from "@/features/driving-licence/domain/provinces";

function getAge(date: Date): number {
  const today = new Date();
  return (
    today.getFullYear() -
    date.getFullYear() -
    (today < new Date(today.getFullYear(), date.getMonth(), date.getDate())
      ? 1
      : 0)
  );
}

export const DateOfBirthSchema = z.coerce
  .date({ error: "Invalid date" })
  .max(new Date(), { message: "Date of birth cannot be in the future" })
  .refine((date) => getAge(date) >= 16, "Must be at least 16 years old")
  .refine((date) => getAge(date) <= 85, "Must be 85 years old or younger");

export const GenderSchema = z.enum(["Male", "Female"]);

export const LicenceFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  dateOfBirth: DateOfBirthSchema,
  province: z.enum(canadianProvinces, {
    error: "Please select a valid Canadian province",
  }),
  gender: GenderSchema,
  email: z.email("Please enter a valid email address").trim(),
});

export const LicenceResultSchema = LicenceFormSchema.extend({
  licenceNumber: z.string(),
  generatedAt: z.string(),
});

export type Gender = z.infer<typeof GenderSchema>;
export type LicenceForm = z.infer<typeof LicenceFormSchema>;
export type LicenceResult = z.infer<typeof LicenceResultSchema>;

/**
 * Validates a complete LicenceForm. Returns a typed result so callers can
 * branch on `success` without try/catch.
 */
export function validateLicenceForm(
  form: unknown,
): z.ZodSafeParseResult<LicenceForm> {
  return LicenceFormSchema.safeParse(form);
}

/**
 * Validates a single field. Useful for inline field-level feedback.
 * Returns the first error message for that field, or undefined if valid.
 */
export function validateLicenceField<K extends keyof LicenceForm>(
  field: K,
  value: unknown,
): string | undefined {
  const result = LicenceFormSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

// ─── Domain helpers ──────────────────────────────────────────────────────────

export const emptyLicenceForm: Partial<LicenceForm> = {
  firstName: "",
  lastName: "",
  dateOfBirth: undefined,
  province: "",
  gender: "Male",
  email: "",
};

/**
 * Returns true when all fields are filled in sufficiently to attempt
 * generation. Does not run full validation — use validateLicenceForm for that.
 */
export function canGenerateLicence(form: unknown): boolean {
  return LicenceFormSchema.safeParse(form).success;
}

export function normalizeLicenceForm(form: LicenceForm): LicenceForm {
  return LicenceFormSchema.parse(form);
}

export function createRandomLicenceForm(): LicenceForm {
  const sex = faker.person.sexType();
  const gender = sex === "female" ? "Female" : "Male";
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    dateOfBirth: faker.date.birthdate({ min: 16, max: 85, mode: "age" }),
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
    licenceNumber: generateLicenceNumber(normalizedForm),
    generatedAt,
  };
}

export function generateLicenceNumber(form: LicenceForm): string {
  const source = `${form.firstName}|${form.lastName}|${form.dateOfBirth.toISOString().slice(0, 10)}|${form.province}|${form.email}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  return `SMP-${hash.toString(36).toUpperCase().padStart(8, "0").slice(0, 8)}`;
}
