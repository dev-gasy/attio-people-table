import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";

import type { StringFieldApi } from "@/components/ui/form-field";
import {
  canGenerateLicence,
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
] as const;

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

  const canGenerate = useMemo(() => canGenerateLicence(values), [values]);

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
          const error = validateLicenceField(name, valuesRef.current[name]);
          setFieldMeta((currentMeta) => ({
            ...currentMeta,
            [name]: {
              ...currentMeta[name],
              errors: error ? [error] : [],
              isBlurred: true,
            },
          }));
        },
        handleChange: (nextValue) => {
          const error = validateLicenceField(name, nextValue);
          setValues((currentValues) => ({
            ...currentValues,
            [name]: nextValue,
          }));
          setFieldMeta((currentMeta) => ({
            ...currentMeta,
            [name]: {
              ...currentMeta[name],
              errors: error ? [error] : [],
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
      handleSubmit: () => {
        const nextMeta = licenceFormFields.reduce<FieldMetaMap>(
          (currentMeta, fieldName) => {
            const error = validateLicenceField(fieldName, values[fieldName]);
            currentMeta[fieldName] = {
              errors: error ? [error] : [],
              isBlurred: true,
              isTouched: true,
            };
            return currentMeta;
          },
          {},
        );
        setFieldMeta(nextMeta);
      },
    }),
    [Field, values],
  );

  function handleReset() {
    setProgrammaticValues(emptyLicenceForm);
  }

  function handleRandomize() {
    setProgrammaticValues(createRandomLicenceFormValues());
  }

  return { canGenerate, form, handleRandomize, handleReset, result };
}
