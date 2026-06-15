import { useMemo, useState, type FormEvent } from "react";
import {
  canGenerateLicence,
  createLicenceResult,
  emptyLicenceForm,
  type LicenceForm,
} from "@/features/driving-licence/domain/licence";

export function useDrivingLicencePage() {
  const [form, setForm] = useState<LicenceForm>(emptyLicenceForm);
  const [result, setResult] = useState<ReturnType<
    typeof createLicenceResult
  > | null>(null);

  const canGenerate = useMemo(() => canGenerateLicence(form), [form]);

  function updateForm(values: Partial<LicenceForm>) {
    setForm((currentForm) => ({ ...currentForm, ...values }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canGenerate) return;

    setResult(createLicenceResult(form));
  }

  function handleReset() {
    setForm(emptyLicenceForm);
    setResult(null);
  }

  return {
    canGenerate,
    form,
    handleReset,
    handleSubmit,
    result,
    updateForm,
  };
}
