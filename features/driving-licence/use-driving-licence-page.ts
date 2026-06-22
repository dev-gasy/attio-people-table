import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";

import type { StringFieldApi } from "@/components/ui/form-field";
import {
  createLicenceResult,
  createRandomLicenceFormValues,
  emptyLicenceForm,
  type LicenceFormValues,
  validateLicenceField,
  validateLicenceForm,
} from "@/features/driving-licence/domain/licence";

type LicenceFieldName = keyof LicenceFormValues;

type FieldMeta = {
  errors?: unknown[];
  isBlurred?: boolean;
  isTouched?: boolean;
};

type FieldMetaMap = Partial<Record<LicenceFieldName, FieldMeta>>;

type FieldProps<TName extends LicenceFieldName> = {
  children: (field: StringFieldApi<LicenceFormValues[TName]>) => ReactNode;
  name: TName;
};

const licenceFormFields = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "province",
  "gender",
  "email",
] as const satisfies ReadonlyArray<LicenceFieldName>;

/** Extracts cross-field error messages keyed by field name from a full parse. */
function extractCrossFieldErrors(
  form: LicenceFormValues,
): Partial<Record<LicenceFieldName, string>> {
  const parsed = validateLicenceForm(form);
  if (parsed.success) return {};

  const out: Partial<Record<LicenceFieldName, string>> = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as LicenceFieldName | undefined;
    if (field && !out[field]) {
      out[field] = issue.message;
    }
  }
  return out;
}

export function useDrivingLicencePage() {
  const [values, setValues] = useState<LicenceFormValues>(emptyLicenceForm);
  const [fieldMeta, setFieldMeta] = useState<FieldMetaMap>({});
  const valuesRef = useRef(values);
  const fieldMetaRef = useRef(fieldMeta);

  valuesRef.current = values;
  fieldMetaRef.current = fieldMeta;

  const result = useMemo(() => {
    const parsed = validateLicenceForm(values);
    return parsed.success ? createLicenceResult(parsed.data) : null;
  }, [values]);

  // Derived from `result` — avoids a second parse of the same values.
  const canGenerate = result !== null;

  /** How many fields have a non-empty value (for progress display). */
  const filledCount = useMemo(
    () =>
      licenceFormFields.filter((f) => {
        const v = values[f];
        return typeof v === "string" && v.trim().length > 0;
      }).length,
    [values],
  );

  const totalFields = licenceFormFields.length;

  const isFormEmpty = useMemo(
    () =>
      licenceFormFields.every(
        (field) => values[field] === emptyLicenceForm[field],
      ),
    [values],
  );

  const resetMeta = useCallback(() => {
    setFieldMeta({});
  }, []);

  const setProgrammaticValues = useCallback(
    (nextValues: LicenceFormValues) => {
      setValues(nextValues);
      resetMeta();
    },
    [resetMeta],
  );

  const Field = useCallback(
    <TName extends LicenceFieldName>({ children, name }: FieldProps<TName>) => {
      const value = valuesRef.current[name];
      const meta = fieldMetaRef.current[name] ?? {};

      const field: StringFieldApi<LicenceFormValues[TName]> = {
        name,
        state: {
          value,
          meta,
        },
        handleBlur: () => {
          setFieldMeta((currentMeta) => ({
            ...currentMeta,
            [name]: {
              ...currentMeta[name],
              isBlurred: true,
            },
          }));
        },
        handleChange: (nextValue) => {
          const nextValues = { ...valuesRef.current, [name]: nextValue };
          const fieldError = validateLicenceField(name, nextValue);
          // Re-evaluate cross-field errors on every change so stale errors clear
          const crossErrors = extractCrossFieldErrors(nextValues);

          setValues(nextValues);
          setFieldMeta((currentMeta) => ({
            ...currentMeta,
            [name]: {
              ...currentMeta[name],
              errors: (() => {
                const errs: string[] = [];
                if (fieldError) errs.push(fieldError);
                else if (crossErrors[name]) errs.push(crossErrors[name]!);
                return errs;
              })(),
              isTouched: true,
            },
          }));
        },
      };

      return children(field);
    },
    [],
  );

  const form = useMemo(
    () => ({
      Field,
      /** Marks all fields as touched+blurred and surfaces all errors including cross-field ones. */
      handleSubmit: () => {
        const currentValues = valuesRef.current;
        const crossErrors = extractCrossFieldErrors(currentValues);

        const nextMeta = licenceFormFields.reduce<FieldMetaMap>(
          (acc, fieldName) => {
            const fieldError = validateLicenceField(
              fieldName,
              currentValues[fieldName],
            );
            const errs: string[] = [];
            if (fieldError) errs.push(fieldError);
            else if (crossErrors[fieldName]) errs.push(crossErrors[fieldName]!);
            acc[fieldName] = {
              errors: errs,
              isBlurred: true,
              isTouched: true,
            };
            return acc;
          },
          {},
        );
        setFieldMeta(nextMeta);
      },
    }),
    [Field],
  );

  function handleReset() {
    setProgrammaticValues(emptyLicenceForm);
  }

  function handleRandomize() {
    setProgrammaticValues(createRandomLicenceFormValues());
  }

  return {
    canGenerate,
    filledCount,
    form,
    handleRandomize,
    handleReset,
    isFormEmpty,
    result,
    totalFields,
  };
}
