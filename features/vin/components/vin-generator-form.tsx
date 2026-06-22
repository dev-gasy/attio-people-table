import type { ReactNode } from "react";
import { AlertTriangle, CarFront, Factory } from "lucide-react";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Collapsible } from "@/components/ui/collapsible-section";
import {
  createVinYearOptions,
  type VinGeneratorFormValues,
} from "@/features/vin/domain/vin";
import type {
  VinBrandModel,
  VinVehicleModel,
  VinWmiModel,
} from "@/features/vin/services/vin.types";
import { cn } from "@/lib/utils";

type VinFieldName = keyof VinGeneratorFormValues;

type QueryState<TData> = {
  data?: TData;
  error: unknown;
  isFetching: boolean;
  isLoading: boolean;
};

type WmiStatus = {
  message: string;
  tone: "default" | "error";
};

export function VinGeneratorForm({
  brands,
  formValues,
  generatedVinError,
  models,
  onValueChange,
  selectedWmi,
  wmis,
}: {
  brands: QueryState<VinBrandModel[]>;
  formValues: VinGeneratorFormValues;
  generatedVinError: string | null;
  models: QueryState<VinVehicleModel[]>;
  onValueChange: (field: VinFieldName, value: string) => void;
  selectedWmi: VinWmiModel | null;
  wmis: QueryState<VinWmiModel[]>;
}) {
  const brandOptions = toOptions(brands.data ?? [], (brand) => brand.name);
  const modelOptions = toOptions(models.data ?? [], (model) => model.name);
  const yearOptions = createVinYearOptions();
  const statusMessages = [
    toErrorMessage(brands.error),
    toErrorMessage(models.error),
    toErrorMessage(wmis.error),
    generatedVinError,
  ].filter((message): message is string => message !== null);
  const wmiStatus = getWmiStatus({
    brand: formValues.brand,
    selectedWmi,
    wmisError: toErrorMessage(wmis.error),
    wmisLoading: wmis.isFetching,
  });

  return (
    <Collapsible
      title="Generator"
      subtitle="VIN updates automatically when selections are complete"
    >
      <div className="grid gap-4 p-4 md:grid-cols-3">
        <ComboField label="Year">
          <Combobox
            options={yearOptions}
            value={formValues.year || null}
            onChange={(value) => onValueChange("year", value ?? "")}
            placeholder="Select year"
            searchPlaceholder="Search year..."
            icon={CarFront}
            clearable={false}
          />
        </ComboField>

        <ComboField label="Brand">
          <Combobox
            options={brandOptions}
            value={formValues.brand || null}
            onChange={(value) => onValueChange("brand", value ?? "")}
            placeholder={
              brands.isLoading ? "Loading brands..." : "Search brand"
            }
            searchPlaceholder="Search brand..."
            icon={Factory}
            disabled={brands.isLoading || brandOptions.length === 0}
          />
        </ComboField>

        <ComboField label="Model">
          <Combobox
            options={modelOptions}
            value={formValues.model || null}
            onChange={(value) => onValueChange("model", value ?? "")}
            placeholder={
              models.isFetching ? "Loading models..." : "Search model"
            }
            searchPlaceholder="Search model..."
            icon={CarFront}
            disabled={isModelDisabled(formValues, models, modelOptions)}
          />
        </ComboField>
      </div>

      <StatusMessages messages={statusMessages} />

      <div
        className={cn(
          "border-t border-border px-4 py-3 text-xs",
          wmiStatus.tone === "error"
            ? "text-destructive"
            : "text-muted-foreground",
        )}
      >
        {wmiStatus.message}
      </div>
    </Collapsible>
  );
}

function ComboField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function StatusMessages({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-1 px-4 pb-3">
      {Array.from(new Set(messages)).map((message) => (
        <p
          key={message}
          className="flex items-center gap-2 text-xs text-destructive"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {message}
        </p>
      ))}
    </div>
  );
}

function toOptions<TItem>(
  items: TItem[],
  getName: (item: TItem) => string,
): ComboOption[] {
  return items.map((item) => {
    const name = getName(item);
    return { label: name, value: name };
  });
}

function toErrorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

function isModelDisabled(
  formValues: VinGeneratorFormValues,
  models: QueryState<VinVehicleModel[]>,
  modelOptions: ComboOption[],
) {
  return (
    !formValues.brand ||
    !formValues.year ||
    models.isFetching ||
    modelOptions.length === 0
  );
}

function getWmiStatus({
  brand,
  selectedWmi,
  wmisError,
  wmisLoading,
}: {
  brand: string;
  selectedWmi: VinWmiModel | null;
  wmisError: string | null;
  wmisLoading: boolean;
}): WmiStatus {
  if (!brand) {
    return {
      message: "Select a brand to load manufacturer WMI data.",
      tone: "default",
    };
  }

  if (wmisLoading) {
    return { message: "Loading WMI data...", tone: "default" };
  }

  if (wmisError) {
    return { message: wmisError, tone: "error" };
  }

  if (!selectedWmi) {
    return {
      message: "No passenger-car WMI found for this brand.",
      tone: "error",
    };
  }

  return {
    message: `${selectedWmi.wmi} - ${selectedWmi.name}`,
    tone: "default",
  };
}
