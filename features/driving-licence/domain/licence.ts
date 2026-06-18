import { faker } from "@faker-js/faker";
import { z } from "zod";
import { canadianProvinces } from "@/features/driving-licence/domain/provinces";

// ---------------------------------------------------------------------------
// Base enums / constants
// ---------------------------------------------------------------------------

export const GenderSchema = z.enum(["Male", "Female", "Other"]);
export const ProvinceSchema = z.enum(canadianProvinces, {
  error: "Please select a valid Canadian province",
});

export type Gender = z.infer<typeof GenderSchema>;
export type Province = z.infer<typeof ProvinceSchema>;

/** Minimum driving age per province/territory (all currently 16 in Canada). */
export const MINIMUM_DRIVING_AGE: Record<Province, number> = Object.fromEntries(
  canadianProvinces.map((p) => [p, 16]),
) as Record<Province, number>;

export const MAXIMUM_LICENCE_AGE = 85;

// ---------------------------------------------------------------------------
// Form value types (raw strings coming from inputs)
// ---------------------------------------------------------------------------

export type LicenceFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  province: Province | "";
  gender: Gender | "";
  email: string;
};

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function toDateInputParts(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function formatLicenceDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateLicenceAge(
  dateOfBirth: Date,
  referenceDate = new Date(),
): number {
  return (
    referenceDate.getFullYear() -
    dateOfBirth.getFullYear() -
    (referenceDate <
    new Date(
      referenceDate.getFullYear(),
      dateOfBirth.getMonth(),
      dateOfBirth.getDate(),
    )
      ? 1
      : 0)
  );
}

// ---------------------------------------------------------------------------
// Field-level schemas
// ---------------------------------------------------------------------------

/** Accepts names with letters, spaces, hyphens, apostrophes (international). */
const NameSchema = z
  .string()
  .trim()
  .min(1, "Required")
  .max(50, "Must be 50 characters or fewer")
  .regex(
    /^[\p{L}\s'-]+$/u,
    "Only letters, spaces, hyphens, and apostrophes are allowed",
  );

export const DateOfBirthSchema = z
  .date({ error: "Invalid date" })
  .max(new Date(), { message: "Date of birth cannot be in the future" })
  .refine(
    (date) => calculateLicenceAge(date) <= MAXIMUM_LICENCE_AGE,
    `Must be ${MAXIMUM_LICENCE_AGE} years old or younger`,
  );

/**
 * Validates a raw date string (yyyy-mm-dd), transforms it to a `Date`,
 * then applies `DateOfBirthSchema` rules.
 */
export const DateOfBirthValueSchema = z
  .string()
  .trim()
  .min(1, "Date of birth is required")
  .transform((value, context) => {
    const parts = toDateInputParts(value);

    if (!parts) {
      context.addIssue({
        code: "custom",
        message: "Use the format yyyy-mm-dd",
      });
      return z.NEVER;
    }

    const date = new Date(parts.year, parts.month - 1, parts.day);
    const isValidDate =
      date.getFullYear() === parts.year &&
      date.getMonth() === parts.month - 1 &&
      date.getDate() === parts.day;

    if (!isValidDate) {
      context.addIssue({ code: "custom", message: "Enter a real date" });
      return z.NEVER;
    }

    return date;
  })
  .pipe(DateOfBirthSchema);

// ---------------------------------------------------------------------------
// Form schema — single source of truth
// Accepts raw string inputs, transforms/coerces to typed outputs.
// ---------------------------------------------------------------------------

/**
 * Validates raw form values (all strings) and produces a fully-typed
 * `LicenceForm`. This is the only schema used for both per-field and
 * whole-form validation.
 */
export const LicenceFormValuesSchema = z
  .object({
    firstName: NameSchema.refine(
      (v) => v.length >= 1,
      "First name is required",
    ),
    lastName: NameSchema.refine((v) => v.length >= 1, "Last name is required"),
    dateOfBirth: DateOfBirthValueSchema,
    province: ProvinceSchema,
    gender: GenderSchema,
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .transform((v) => v.toLowerCase()),
  })
  .superRefine((data, context) => {
    // Cross-field: enforce province-specific minimum driving age
    const minAge = MINIMUM_DRIVING_AGE[data.province];
    if (
      minAge !== undefined &&
      calculateLicenceAge(data.dateOfBirth) < minAge
    ) {
      context.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: `Must be at least ${minAge} years old to hold a licence in ${data.province}`,
      });
    }
  });

export type LicenceForm = z.output<typeof LicenceFormValuesSchema>;

// ---------------------------------------------------------------------------
// Result schema
// ---------------------------------------------------------------------------

export const LicenceResultSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  fullName: z.string(),
  dateOfBirth: z.string(),
  age: z.number(),
  province: ProvinceSchema,
  gender: GenderSchema,
  email: z.string(),
  licenceNumber: z.string(),
  issueDate: z.string(),
  expiryDate: z.string(),
  generatedAt: z.string(),
});

export type LicenceResult = z.infer<typeof LicenceResultSchema>;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export function validateLicenceForm(
  form: unknown,
): z.ZodSafeParseResult<LicenceForm> {
  return LicenceFormValuesSchema.safeParse(form);
}

/**
 * Validates a single field in isolation.
 * Returns the first error message, or `undefined` if valid.
 *
 * Note: cross-field rules (superRefine) are not evaluated here — those are
 * only checked on full form submission / result generation.
 */
export function validateLicenceField<K extends keyof LicenceFormValues>(
  field: K,
  value: unknown,
): string | undefined {
  // .shape is the public ZodObject API; available even after superRefine in Zod v4.
  // Note: cross-field rules (superRefine) are intentionally skipped here —
  // those are only surfaced on full form submission via validateLicenceForm.
  const fieldSchema = LicenceFormValuesSchema.shape[field];
  if (!fieldSchema) return undefined;

  const result = (fieldSchema as z.ZodTypeAny).safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

export function canGenerateLicence(form: unknown): boolean {
  return LicenceFormValuesSchema.safeParse(form).success;
}

export function normalizeLicenceForm(form: unknown): LicenceForm {
  return LicenceFormValuesSchema.parse(form);
}

export function toLicenceFormValues(form: LicenceForm): LicenceFormValues {
  return {
    ...form,
    dateOfBirth: formatLicenceDateInput(form.dateOfBirth),
  };
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const emptyLicenceForm: LicenceFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  province: "",
  // No default gender — the user must make an explicit choice.
  gender: "",
  email: "",
};

// ---------------------------------------------------------------------------
// Random data generation (development / testing only)
// ---------------------------------------------------------------------------

export function createRandomLicenceForm(): LicenceForm {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const gender = sex === "female" ? "Female" : "Male";
  return {
    firstName,
    lastName,
    dateOfBirth: faker.date.birthdate({ min: 16, max: 80, mode: "age" }),
    province: faker.helpers.arrayElement(canadianProvinces),
    gender,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
  };
}

export function createRandomLicenceFormValues(): LicenceFormValues {
  return toLicenceFormValues(createRandomLicenceForm());
}

// ---------------------------------------------------------------------------
// Licence number generation
// ---------------------------------------------------------------------------

/**
 * Deterministic licence number derived from form inputs using FNV-1a 32-bit.
 * Better collision resistance than a simple polynomial hash.
 * Marked "SAMPLE" to make clear this is not an official document.
 */
export function generateLicenceNumber(form: LicenceForm): string {
  const source = [
    form.firstName,
    form.lastName,
    formatLicenceDateInput(form.dateOfBirth),
    form.province,
    form.email,
  ].join("|");

  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  for (let i = 0; i < source.length; i++) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  return `SAMPLE-${hash.toString(16).toUpperCase().padStart(8, "0")}`;
}

// ---------------------------------------------------------------------------
// Result creation
// ---------------------------------------------------------------------------

export function createLicenceResult(
  form: LicenceForm,
  referenceDate = new Date(),
): LicenceResult {
  const issueDate = formatLicenceDateInput(referenceDate);
  const expiryDate = addYears(referenceDate, 5);

  return {
    firstName: form.firstName,
    lastName: form.lastName,
    fullName: `${form.firstName} ${form.lastName}`,
    dateOfBirth: formatLicenceDateInput(form.dateOfBirth),
    age: calculateLicenceAge(form.dateOfBirth, referenceDate),
    province: form.province,
    gender: form.gender,
    email: form.email,
    licenceNumber: generateLicenceNumber(form),
    issueDate,
    expiryDate: formatLicenceDateInput(expiryDate),
    generatedAt: issueDate,
  };
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}
