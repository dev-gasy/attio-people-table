import { useEffect, useMemo, useState } from "react";
import {
  emptyVinGeneratorForm,
  getGeneratedVinResult,
  validateVin,
  type VinGeneratorFormValues,
} from "@/features/vin/domain/vin";
import {
  useVinBrandsQuery,
  useVinModelsQuery,
  useVinWmisQuery,
} from "@/features/vin/services/vin.queries";

type UseVinGeneratorOptions = {
  initialValidatorInput?: string;
};

export function useVinGenerator({
  initialValidatorInput = "",
}: UseVinGeneratorOptions = {}) {
  const [formValues, setFormValues] = useState<VinGeneratorFormValues>(
    emptyVinGeneratorForm,
  );
  const [validatorInput, setValidatorInput] = useState(initialValidatorInput);

  useEffect(() => {
    setValidatorInput(initialValidatorInput);
  }, [initialValidatorInput]);

  const brands = useVinBrandsQuery();
  const models = useVinModelsQuery({
    brand: formValues.brand,
    year: formValues.year,
  });
  const wmis = useVinWmisQuery(formValues.brand);

  const selectedWmi = wmis.data?.[0] ?? null;
  const generatedVin = useMemo(
    () => getGeneratedVinResult(formValues, selectedWmi),
    [formValues, selectedWmi],
  );
  const validationResult = useMemo(
    () => (validatorInput.trim() ? validateVin(validatorInput) : null),
    [validatorInput],
  );

  function updateField(field: keyof VinGeneratorFormValues, value: string) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
      ...(field === "brand" || field === "year" ? { model: "" } : {}),
    }));
  }

  function reset() {
    setFormValues(emptyVinGeneratorForm);
  }

  return {
    brands,
    formValues,
    generatedVin,
    isFormEmpty: isVinGeneratorFormEmpty(formValues),
    models,
    reset,
    selectedWmi,
    setValidatorInput,
    updateField,
    validationResult,
    validatorInput,
    wmis,
  };
}

function isVinGeneratorFormEmpty(formValues: VinGeneratorFormValues) {
  return !formValues.brand && !formValues.model && !formValues.year;
}
