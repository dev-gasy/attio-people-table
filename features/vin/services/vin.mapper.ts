import type {
  VinBrandDto,
  VinBrandModel,
  VinModelDto,
  VinVehicleModel,
  VinWmiDto,
  VinWmiModel,
} from "./vin.types";

export const vinMapper = {
  toBrandModels(dtos: VinBrandDto[]): VinBrandModel[] {
    return dedupeBy(
      dtos
        .map((dto) => ({
          id: toId(dto.MakeId ?? dto.MakeName),
          name: normalizeText(dto.MakeName),
          vehicleType: normalizeText(dto.VehicleTypeName) || null,
        }))
        .filter((brand) => brand.id && brand.name)
        .sort((a, b) => a.name.localeCompare(b.name)),
      (brand) => brand.name.toLowerCase(),
    );
  },

  toVehicleModels(dtos: VinModelDto[]): VinVehicleModel[] {
    return dedupeBy(
      dtos
        .map((dto) => ({
          id: toId(dto.Model_ID ?? dto.Model_Name),
          makeId: toId(dto.Make_ID),
          makeName: normalizeText(dto.Make_Name),
          name: normalizeText(dto.Model_Name),
        }))
        .filter((model) => model.id && model.name)
        .sort((a, b) => a.name.localeCompare(b.name)),
      (model) => model.name.toLowerCase(),
    );
  },

  toWmiModels(dtos: VinWmiDto[]): VinWmiModel[] {
    return dedupeBy(
      dtos
        .map((dto) => ({
          country: normalizeText(dto.Country) || null,
          id: toId(dto.Id ?? dto.WMI),
          name: normalizeText(dto.Name) || "Unknown manufacturer",
          vehicleType: normalizeText(dto.VehicleType) || null,
          wmi: normalizeText(dto.WMI).toUpperCase(),
        }))
        .filter((wmi) => wmi.id && /^[A-HJ-NPR-Z0-9]{3}$/.test(wmi.wmi))
        .sort((a, b) => a.wmi.localeCompare(b.wmi)),
      (wmi) => wmi.wmi,
    );
  },
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toId(value: unknown): string {
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value.trim();
  return "";
}

function dedupeBy<TItem>(
  items: TItem[],
  getKey: (item: TItem) => string,
): TItem[] {
  const seen = new Set<string>();
  const deduped: TItem[] = [];

  for (const item of items) {
    const key = getKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}
