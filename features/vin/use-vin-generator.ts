import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
  initialFormValues?: VinGeneratorFormValues;
  initialValidatorInput?: string;
};

export function useVinGenerator({
  initialFormValues,
  initialValidatorInput = "",
}: UseVinGeneratorOptions = {}) {
  const navigate = useNavigate();
  const initialBrand = initialFormValues?.brand ?? "";
  const initialModel = initialFormValues?.model ?? "";
  const initialYear = initialFormValues?.year ?? "";
  const [formValues, setFormValues] = useState<VinGeneratorFormValues>(
    {
      brand: initialBrand,
      model: initialModel,
      year: initialYear,
    },
  );
  const [validatorInput, setValidatorInputState] =
    useState(initialValidatorInput);

  useEffect(() => {
    setFormValues({
      brand: initialBrand,
      model: initialModel,
      year: initialYear,
    });
  }, [initialBrand, initialModel, initialYear]);

  useEffect(() => {
    setValidatorInputState(initialValidatorInput);
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
    const nextFormValues = {
      ...formValues,
      [field]: value,
      ...(field === "brand" || field === "year" ? { model: "" } : {}),
    };

    setFormValues(nextFormValues);
    navigateVinSearch(nextFormValues, validatorInput);
  }

  function setValidatorInput(value: string) {
    setValidatorInputState(value);
    navigateVinSearch(formValues, value);
  }

  function reset() {
    setFormValues(emptyVinGeneratorForm);
    navigateVinSearch(emptyVinGeneratorForm, validatorInput);
  }

  function navigateVinSearch(
    nextFormValues: VinGeneratorFormValues,
    nextValidatorInput: string,
  ) {
    void navigate({
      to: "/vin",
      replace: true,
      search: {
        brand: toSearchValue(nextFormValues.brand),
        model: toSearchValue(nextFormValues.model),
        vin: toSearchValue(nextValidatorInput),
        year: toSearchValue(nextFormValues.year),
      },
    });
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

function toSearchValue(value: string) {
  return value.trim() ? value : undefined;
}
