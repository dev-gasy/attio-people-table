import { useForm, useStore } from "@tanstack/react-form";

import {
  createLicenceResult,
  createRandomLicenceFormValues,
  emptyLicenceForm,
  LicenceFormValues,
  LicenceFormValuesSchema,
  merge,
  validateLicenceForm,
} from "@/features/driving-licence/domain/licence";

export function useDrivingLicencePage() {
  const form = useForm({
    defaultValues: emptyLicenceForm,
    validators: {
      onBlur: LicenceFormValuesSchema,
      onSubmit: LicenceFormValuesSchema,
    },
  });

  const reset = (newValues: Partial<LicenceFormValues>) => {
    form.reset(merge(newValues, emptyLicenceForm));
    form.setFieldValue(
      "province",
      newValues.province ?? emptyLicenceForm.province,
    );
  };

  const result = useStore(form.store, (state) => {
    const parsed = validateLicenceForm(state.values);
    return parsed.success ? createLicenceResult(parsed.data) : null;
  });

  function handleReset() {
    reset(emptyLicenceForm);
  }

  function handleRandomize() {
    form.reset(createRandomLicenceFormValues());
  }

  return { form, handleRandomize, handleReset, result };
}
