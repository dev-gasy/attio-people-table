import { z } from "zod";

const VIN_LENGTH = 17;
const CHECK_DIGIT_INDEX = 8;
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
const VIN_TRANSLITERATION: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9,
};

const MODEL_YEAR_CODES = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "M",
  "N",
  "P",
  "R",
  "S",
  "T",
  "V",
  "W",
  "X",
  "Y",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;

const VIN_ALLOWED_CHARACTER_PATTERN = /^[A-HJ-NPR-Z0-9]+$/;
const VIN_SEPARATOR_PATTERN = /[\s-]+/g;
const VIN_SYNTHETIC_ALPHABET = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";

export const MIN_MODEL_YEAR = 1996;
export const MAX_MODEL_YEAR = new Date().getFullYear() + 1;

export type VinValidationStatus = "valid" | "invalid";

export type VinValidationResult = {
  actualCheckDigit: string | null;
  errors: string[];
  expectedCheckDigit: string | null;
  isValid: boolean;
  normalizedVin: string;
  status: VinValidationStatus;
};

export type VinGeneratorFormValues = {
  brand: string;
  model: string;
  year: string;
};

export type VinWmiInput = {
  name: string;
  wmi: string;
};

export type VinGenerationResult = {
  brand: string;
  checkDigit: string;
  generatedAt: string;
  model: string;
  modelYearCode: string;
  plantCode: string;
  serialNumber: string;
  vin: string;
  vds: string;
  wmi: string;
  wmiName: string;
  year: number;
};

export type GeneratedVinResult = {
  error: string | null;
  result: VinGenerationResult | null;
};

export const VinGeneratorFormSchema = z.object({
  brand: z.string().trim().min(1, "Select a brand"),
  model: z.string().trim().min(1, "Select a model"),
  year: z
    .string()
    .trim()
    .min(1, "Select a year")
    .transform((value, context) => {
      const year = Number(value);
      if (!Number.isInteger(year)) {
        context.addIssue({ code: "custom", message: "Select a valid year" });
        return z.NEVER;
      }
      return year;
    })
    .pipe(
      z
        .number()
        .int()
        .min(MIN_MODEL_YEAR, `Year must be ${MIN_MODEL_YEAR} or newer`)
        .max(MAX_MODEL_YEAR, `Year must be ${MAX_MODEL_YEAR} or older`),
    ),
});

export type VinGeneratorForm = z.output<typeof VinGeneratorFormSchema>;

export const emptyVinGeneratorForm: VinGeneratorFormValues = {
  brand: "",
  model: "",
  year: "",
};

export class VinService {
  normalizeVin(value: string): string {
    return value.trim().toUpperCase().replace(VIN_SEPARATOR_PATTERN, "");
  }

  validateVin(value: string): VinValidationResult {
    const normalizedVin = this.normalizeVin(value);
    const errors: string[] = [];
    const actualCheckDigit =
      normalizedVin.length > CHECK_DIGIT_INDEX
        ? normalizedVin[CHECK_DIGIT_INDEX]
        : null;

    if (normalizedVin.length !== VIN_LENGTH) {
      errors.push("VIN number must be 17 characters");
    }

    for (const char of normalizedVin) {
      if (!isVinCharacter(char)) {
        errors.push(`Illegal character: ${char}`);
        break;
      }
    }

    if (
      actualCheckDigit !== null &&
      actualCheckDigit !== "X" &&
      !/^\d$/.test(actualCheckDigit)
    ) {
      errors.push(`Illegal check digit: ${actualCheckDigit}`);
    }

    const canCalculate =
      normalizedVin.length === VIN_LENGTH &&
      VIN_ALLOWED_CHARACTER_PATTERN.test(normalizedVin) &&
      actualCheckDigit !== null &&
      (actualCheckDigit === "X" || /^\d$/.test(actualCheckDigit));

    const expectedCheckDigit = canCalculate
      ? this.calculateCheckDigit(normalizedVin)
      : null;

    if (
      expectedCheckDigit !== null &&
      actualCheckDigit !== null &&
      expectedCheckDigit !== actualCheckDigit
    ) {
      errors.push(`Invalid check digit: expected ${expectedCheckDigit}`);
    }

    return {
      actualCheckDigit,
      errors,
      expectedCheckDigit,
      isValid: errors.length === 0,
      normalizedVin,
      status: errors.length === 0 ? "valid" : "invalid",
    };
  }

  calculateCheckDigit(vin: string): string {
    const normalizedVin = this.normalizeVin(vin);
    if (normalizedVin.length !== VIN_LENGTH) {
      throw new Error("VIN number must be 17 characters");
    }

    const sum = Array.from(normalizedVin).reduce((total, char, index) => {
      return total + getVinCharacterValue(char) * VIN_WEIGHTS[index];
    }, 0);

    const remainder = sum % 11;
    return remainder === 10 ? "X" : String(remainder);
  }

  encodeModelYear(year: number): string {
    if (
      !Number.isInteger(year) ||
      year < MIN_MODEL_YEAR ||
      year > MAX_MODEL_YEAR
    ) {
      throw new Error(
        `Model year must be between ${MIN_MODEL_YEAR} and ${MAX_MODEL_YEAR}`,
      );
    }

    return MODEL_YEAR_CODES[(year - 1980) % MODEL_YEAR_CODES.length];
  }

  createYearOptions(referenceDate = new Date()) {
    const maxYear = referenceDate.getFullYear() + 1;
    return Array.from({ length: maxYear - MIN_MODEL_YEAR + 1 }, (_, index) => {
      const year = String(maxYear - index);
      return { label: year, value: year };
    });
  }

  validateGeneratorForm(form: unknown): z.ZodSafeParseResult<VinGeneratorForm> {
    return VinGeneratorFormSchema.safeParse(form);
  }

  generate({
    brand,
    model,
    wmi,
    year,
  }: {
    brand: string;
    model: string;
    wmi: VinWmiInput;
    year: number;
  }): VinGenerationResult {
    const normalizedWmi = this.normalizeVin(wmi.wmi).slice(0, 3);
    if (
      normalizedWmi.length !== 3 ||
      !VIN_ALLOWED_CHARACTER_PATTERN.test(normalizedWmi)
    ) {
      throw new Error("A valid 3-character WMI is required");
    }

    const modelYearCode = this.encodeModelYear(year);
    const vds = createSyntheticVinSegment(`${brand}|${model}|${year}`, 5);
    const plantCode = createSyntheticVinSegment(`${brand}|${year}|plant`, 1);
    const serialNumber = createSerialNumber(
      `${brand}|${model}|${year}|${wmi.wmi}`,
    );
    const vinWithoutCheckDigit = `${normalizedWmi}${vds}0${modelYearCode}${plantCode}${serialNumber}`;
    const checkDigit = this.calculateCheckDigit(vinWithoutCheckDigit);
    const vin = `${vinWithoutCheckDigit.slice(0, CHECK_DIGIT_INDEX)}${checkDigit}${vinWithoutCheckDigit.slice(CHECK_DIGIT_INDEX + 1)}`;

    return {
      brand,
      checkDigit,
      generatedAt: formatDate(new Date()),
      model,
      modelYearCode,
      plantCode,
      serialNumber,
      vin,
      vds,
      wmi: normalizedWmi,
      wmiName: wmi.name,
      year,
    };
  }

  getGeneratedResult(
    formValues: VinGeneratorFormValues,
    wmi: VinWmiInput | null,
  ): GeneratedVinResult {
    const parsed = this.validateGeneratorForm(formValues);
    if (!parsed.success || !wmi) {
      return { error: null, result: null };
    }

    try {
      return {
        error: null,
        result: this.generate({
          brand: parsed.data.brand,
          model: parsed.data.model,
          wmi,
          year: parsed.data.year,
        }),
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unable to generate VIN",
        result: null,
      };
    }
  }
}

export const vinService = new VinService();

export const normalizeVin = vinService.normalizeVin.bind(vinService);
export const validateVin = vinService.validateVin.bind(vinService);
export const calculateVinCheckDigit =
  vinService.calculateCheckDigit.bind(vinService);
export const encodeVinModelYear = vinService.encodeModelYear.bind(vinService);
export const createVinYearOptions =
  vinService.createYearOptions.bind(vinService);
export const validateVinGeneratorForm =
  vinService.validateGeneratorForm.bind(vinService);
export const generateVin = vinService.generate.bind(vinService);

function getVinCharacterValue(char: string): number {
  if (/^\d$/.test(char)) return Number(char);

  const value = VIN_TRANSLITERATION[char];
  if (value === undefined) {
    throw new Error(`Illegal character: ${char}`);
  }
  return value;
}

function isVinCharacter(char: string): boolean {
  return VIN_ALLOWED_CHARACTER_PATTERN.test(char);
}

function createSyntheticVinSegment(source: string, length: number): string {
  const hash = createHash(source);
  let value = "";

  for (let index = 0; index < length; index++) {
    const charIndex = (hash + index * 17) % VIN_SYNTHETIC_ALPHABET.length;
    value += VIN_SYNTHETIC_ALPHABET[charIndex];
  }

  return value;
}

function createSerialNumber(source: string): string {
  return String(createHash(source) % 1_000_000).padStart(6, "0");
}

function createHash(source: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index++) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
