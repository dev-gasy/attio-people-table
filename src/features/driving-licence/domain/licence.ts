import { fakerEN_CA as faker } from "@faker-js/faker";
import * as v from "valibot";
import { canadianProvinces } from "@/features/driving-licence/domain/provinces";

// ---------------------------------------------------------------------------
// Base enums / constants
// ---------------------------------------------------------------------------

export const GenderSchema = v.picklist(["Male", "Female", "Other"]);
export const ProvinceSchema = v.picklist(
  canadianProvinces,
  "Please select a valid Canadian province",
);

export type Gender = v.InferOutput<typeof GenderSchema>;
export type Province = v.InferOutput<typeof ProvinceSchema>;

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

export function formatLicenceAge(
  dateOfBirth: Date,
  referenceDate = new Date(),
): string {
  let years = referenceDate.getFullYear() - dateOfBirth.getFullYear();
  let months = referenceDate.getMonth() - dateOfBirth.getMonth();
  let days = referenceDate.getDate() - dateOfBirth.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      0,
    ).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years} years, ${months} months, ${days} days`;
}

// ---------------------------------------------------------------------------
// Field-level schemas
// ---------------------------------------------------------------------------

/** Accepts names with letters, spaces, hyphens, apostrophes (international). */
const NameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, "Required"),
  v.maxLength(50, "Must be 50 characters or fewer"),
  v.regex(
    /^[\p{L}\s'-]+$/u,
    "Only letters, spaces, hyphens, and apostrophes are allowed",
  ),
);

export const DateOfBirthSchema = v.pipe(
  v.date("Invalid date"),
  v.maxValue(new Date(), "Date of birth cannot be in the future"),
  v.check(
    (date) => calculateLicenceAge(date) <= MAXIMUM_LICENCE_AGE,
    `Must be ${MAXIMUM_LICENCE_AGE} years old or younger`,
  ),
);

/**
 * Validates a raw date string (yyyy-mm-dd), transforms it to a `Date`,
 * then applies `DateOfBirthSchema` rules.
 */
export const DateOfBirthValueSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(1, "Date of birth is required"),
  v.rawTransform(({ dataset, addIssue, NEVER }) => {
    const value = dataset.value;
    const parts = toDateInputParts(value);

    if (!parts) {
      addIssue({ message: "Use the format yyyy-mm-dd" });
      return NEVER;
    }

    const date = new Date(parts.year, parts.month - 1, parts.day);
    const isValidDate =
      date.getFullYear() === parts.year &&
      date.getMonth() === parts.month - 1 &&
      date.getDate() === parts.day;

    if (!isValidDate) {
      addIssue({ message: "Enter a real date" });
      return NEVER;
    }

    return date;
  }),
  DateOfBirthSchema,
);

// ---------------------------------------------------------------------------
// Form schema — single source of truth
// Accepts raw string inputs, transforms/coerces to typed outputs.
// ---------------------------------------------------------------------------

/**
 * Validates raw form values (all strings) and produces a fully-typed
 * `LicenceForm`. This is the only schema used for both per-field and
 * whole-form validation.
 */
export const LicenceFormValuesSchema = v.pipe(
  v.object({
    firstName: v.pipe(
      NameSchema,
      v.check((value) => value.length >= 1, "First name is required"),
    ),
    lastName: v.pipe(
      NameSchema,
      v.check((value) => value.length >= 1, "Last name is required"),
    ),
    dateOfBirth: DateOfBirthValueSchema,
    province: ProvinceSchema,
    gender: GenderSchema,
  }),
  v.rawCheck(({ dataset, addIssue }) => {
    if (!dataset.typed) return;

    const data = dataset.value;
    // Cross-field: enforce province-specific minimum driving age
    const minAge = MINIMUM_DRIVING_AGE[data.province];
    if (
      minAge !== undefined &&
      calculateLicenceAge(data.dateOfBirth) < minAge
    ) {
      addIssue({
        message: `Must be at least ${minAge} years old to hold a licence in ${data.province}`,
        path: [
          {
            type: "object",
            origin: "value",
            input: data,
            key: "dateOfBirth",
            value: data.dateOfBirth,
          },
        ],
      });
    }
  }),
);

export type LicenceForm = v.InferOutput<typeof LicenceFormValuesSchema>;

// ---------------------------------------------------------------------------
// Result schema
// ---------------------------------------------------------------------------

export const LicenceResultSchema = v.object({
  firstName: v.string(),
  lastName: v.string(),
  fullName: v.string(),
  dateOfBirth: v.string(),
  age: v.string(),
  province: ProvinceSchema,
  gender: GenderSchema,
  email: v.string(),
  phone: v.string(),
  address: v.string(),
  licenceNumber: v.string(),
  issueDate: v.string(),
  expiryDate: v.string(),
  generatedAt: v.string(),
});

export type LicenceResult = v.InferOutput<typeof LicenceResultSchema>;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export function validateLicenceForm(
  form: unknown,
): v.SafeParseResult<typeof LicenceFormValuesSchema> {
  return v.safeParse(LicenceFormValuesSchema, form);
}

/**
 * Validates a single field in isolation.
 * Returns the first error message, or `undefined` if valid.
 *
 * Note: cross-field rules (rawCheck) are not evaluated here — those are
 * only checked on full form submission / result generation.
 */
export function validateLicenceField<K extends keyof LicenceFormValues>(
  field: K,
  value: unknown,
): string | undefined {
  // Note: cross-field rules (rawCheck) are intentionally skipped here —
  // those are only surfaced on full form submission via validateLicenceForm.
  const fieldSchema = LicenceFormValuesSchema.entries[field];
  if (!fieldSchema) return undefined;

  const result = v.safeParse(fieldSchema, value);
  return result.success ? undefined : result.issues[0]?.message;
}

export function canGenerateLicence(form: unknown): boolean {
  return v.safeParse(LicenceFormValuesSchema, form).success;
}

export function normalizeLicenceForm(form: unknown): LicenceForm {
  return v.parse(LicenceFormValuesSchema, form);
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
};

// ---------------------------------------------------------------------------
// Random data generation (development / testing only)
// ---------------------------------------------------------------------------

export function createRandomLicenceForm(): LicenceForm {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const gender = sex === "female" ? "Female" : "Male";
  const province = faker.helpers.arrayElement(canadianProvinces);

  return {
    firstName,
    lastName,
    dateOfBirth: faker.date.birthdate({ min: 16, max: 80, mode: "age" }),
    province,
    gender,
  };
}

export function createRandomLicenceFormValues(): LicenceFormValues {
  return toLicenceFormValues(createRandomLicenceForm());
}

export function createCanadianAddress(province: string): string {
  return `${faker.location.streetAddress()}, ${faker.location.city()}, ${province} ${faker.location.zipCode()}`;
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
  const email = faker.internet
    .email({ firstName: form.firstName, lastName: form.lastName })
    .toLowerCase();

  return {
    firstName: form.firstName,
    lastName: form.lastName,
    fullName: `${form.firstName} ${form.lastName}`,
    dateOfBirth: formatLicenceDateInput(form.dateOfBirth),
    age: formatLicenceAge(form.dateOfBirth, referenceDate),
    province: form.province,
    gender: form.gender,
    email,
    phone: faker.phone.number({ style: "national" }),
    address: createCanadianAddress(form.province),
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
