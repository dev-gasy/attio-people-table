import { faker } from "@faker-js/faker";
import { z } from "zod";
import { canadianProvinces } from "@/features/driving-licence/domain/provinces";

export const GenderSchema = z.enum(["Male", "Female"]);
export const ProvinceSchema = z.enum(canadianProvinces, {
  error: "Please select a valid Canadian province",
});

export type Gender = z.infer<typeof GenderSchema>;
export type Province = z.infer<typeof ProvinceSchema>;

export type LicenceFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  province: Province | "";
  gender: Gender;
  email: string;
};

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

export const DateOfBirthSchema = z
  .date({ error: "Invalid date" })
  .max(new Date(), { message: "Date of birth cannot be in the future" })
  .refine(
    (date) => calculateLicenceAge(date) >= 16,
    "Must be at least 16 years old",
  )
  .refine(
    (date) => calculateLicenceAge(date) <= 85,
    "Must be 85 years old or younger",
  );

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

export const LicenceFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  dateOfBirth: DateOfBirthSchema,
  province: ProvinceSchema,
  gender: GenderSchema,
  email: z.email("Please enter a valid email address").trim(),
});

export const LicenceFormValuesSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  dateOfBirth: DateOfBirthValueSchema,
  province: ProvinceSchema,
  gender: GenderSchema,
  email: z.email("Please enter a valid email address").trim(),
});

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

export type LicenceForm = z.output<typeof LicenceFormSchema>;
export type LicenceResult = z.infer<typeof LicenceResultSchema>;

export function validateLicenceForm(
  form: unknown,
): z.ZodSafeParseResult<LicenceForm> {
  return LicenceFormValuesSchema.safeParse(form);
}

export function validateLicenceField<K extends keyof LicenceFormValues>(
  field: K,
  value: unknown,
): string | undefined {
  const result = LicenceFormValuesSchema.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

export const emptyLicenceForm: LicenceFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  province: "",
  gender: "Male",
  email: "",
};

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

export function createRandomLicenceFormValues(): LicenceFormValues {
  return toLicenceFormValues(createRandomLicenceForm());
}

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

export function generateLicenceNumber(form: LicenceForm): string {
  const source = `${form.firstName}|${form.lastName}|${formatLicenceDateInput(form.dateOfBirth)}|${form.province}|${form.email}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  return `SAMPLE-${hash.toString(36).toUpperCase().padStart(8, "0").slice(0, 8)}`;
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}
