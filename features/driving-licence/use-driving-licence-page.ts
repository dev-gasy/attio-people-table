import { useMemo, useState } from "react";
import {
  canGenerateLicence,
  createLicenceResult,
  createRandomLicenceForm,
  emptyLicenceForm,
  type LicenceForm,
} from "@/features/driving-licence/domain/licence";

export function useDrivingLicencePage() {
  const [form, setForm] = useState<LicenceForm>(emptyLicenceForm);
  const canGenerate = useMemo(() => canGenerateLicence(form), [form]);
  const result = useMemo(
    () => (canGenerate ? createLicenceResult(form) : null),
    [canGenerate, form],
  );

  function updateForm(values: Partial<LicenceForm>) {
    setForm((currentForm) => ({ ...currentForm, ...values }));
  }

  function handleReset() {
    setForm(emptyLicenceForm);
  }

  function handleRandomize() {
    setForm(createRandomLicenceForm());
  }

  return {
    form,
    handleRandomize,
    handleReset,
    result,
    updateForm,
  };
}
