import { useMemo, useState } from "react";
import {
  emptyVinGeneratorForm,
  vinService,
  type GeneratedVinResult,
  type VinGeneratorFormValues,
  type VinValidationResult,
} from "@/features/vin/services/vin.service";
import {
  useVinBrandsQuery,
  useVinModelsQuery,
  useVinWmisQuery,
} from "@/features/vin/services/vin.queries";

type VinFieldName = keyof VinGeneratorFormValues;

export type VinSelectOption = {
  label: string;
  value: string;
};

export function useVinGenerator() {
  const [formValues, setFormValues] = useState<VinGeneratorFormValues>(
    emptyVinGeneratorForm,
  );
  const [validatorInput, setValidatorInput] = useState("");

  const brandsQuery = useVinBrandsQuery();
  const modelsQuery = useVinModelsQuery({
    brand: formValues.brand,
    year: formValues.year,
  });
  const wmisQuery = useVinWmisQuery(formValues.brand);

  const brandOptions = useMemo<VinSelectOption[]>(
    () =>
      (brandsQuery.data ?? []).map((brand) => ({
        value: brand.name,
        label: brand.name,
      })),
    [brandsQuery.data],
  );

  const modelOptions = useMemo<VinSelectOption[]>(
    () => toOptions(modelsQuery.data ?? [], (model) => model.name),
    [modelsQuery.data],
  );

  const yearOptions = useMemo<VinSelectOption[]>(
    () => vinService.createYearOptions(),
    [],
  );

  const selectedWmi = wmisQuery.data?.[0] ?? null;

  const generatedVin = useMemo<GeneratedVinResult>(
    () => vinService.getGeneratedResult(formValues, selectedWmi),
    [formValues, selectedWmi],
  );

  const validationResult = useMemo<VinValidationResult | null>(() => {
    if (!validatorInput.trim()) return null;
    return vinService.validateVin(validatorInput);
  }, [validatorInput]);

  const isFormEmpty =
    formValues.brand === "" &&
    formValues.model === "" &&
    formValues.year === "";

  const modelDisabled =
    !formValues.brand ||
    !formValues.year ||
    modelsQuery.isFetching ||
    modelOptions.length === 0;

  const statusMessages = [
    toErrorMessage(brandsQuery.error),
    toErrorMessage(modelsQuery.error),
    toErrorMessage(wmisQuery.error),
    generatedVin.error,
  ].filter((message): message is string => message !== null);

  function updateFormValue(field: VinFieldName, value: string | null) {
    const nextValue = value ?? "";

    setFormValues((current) => ({
      ...current,
      [field]: nextValue,
      ...(field === "brand" || field === "year" ? { model: "" } : null),
    }));
  }

  function reset() {
    setFormValues(emptyVinGeneratorForm);
  }

  return {
    brandOptions,
    brandsLoading: brandsQuery.isLoading,
    formValues,
    generatedVin,
    isFormEmpty,
    modelDisabled,
    modelOptions,
    modelsLoading: modelsQuery.isFetching,
    reset,
    selectedWmi,
    setValidatorInput,
    statusMessages,
    updateFormValue,
    validationResult,
    validatorInput,
    wmiStatus: getWmiStatus({
      brand: formValues.brand,
      selectedWmi,
      wmisError: toErrorMessage(wmisQuery.error),
      wmisLoading: wmisQuery.isFetching,
    }),
    yearOptions,
  };
}

function toOptions<TItem>(
  items: TItem[],
  getName: (item: TItem) => string,
): VinSelectOption[] {
  return items.map((item) => {
    const name = getName(item);
    return { label: name, value: name };
  });
}

function toErrorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

function getWmiStatus({
  brand,
  selectedWmi,
  wmisError,
  wmisLoading,
}: {
  brand: string;
  selectedWmi: { name: string; wmi: string } | null;
  wmisError: string | null;
  wmisLoading: boolean;
}) {
  if (!brand) return "Select a brand to load manufacturer WMI data.";
  if (wmisLoading) return "Loading WMI data...";
  if (wmisError) return wmisError;
  if (!selectedWmi) return "No passenger-car WMI found for this brand.";
  return `${selectedWmi.wmi} — ${selectedWmi.name}`;
}
