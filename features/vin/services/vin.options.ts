import { queryOptions } from "@tanstack/react-query";
import { vinMapper } from "./vin.mapper";
import { vinApiService } from "./vin-api.service";

export const vinOptions = {
  all: () => ["vin"] as const,

  brands: () =>
    queryOptions({
      queryKey: [...vinOptions.all(), "brands"] as const,
      queryFn: () => vinApiService.getBrands(),
      select: vinMapper.toBrandModels,
      staleTime: 1000 * 60 * 60 * 24,
    }),

  models: ({ brand, year }: { brand: string; year: string }) =>
    queryOptions({
      enabled: Boolean(brand && year),
      queryKey: [...vinOptions.all(), "models", brand, year] as const,
      queryFn: () => vinApiService.getModels({ brand, year }),
      select: vinMapper.toVehicleModels,
      staleTime: 1000 * 60 * 60 * 12,
    }),

  wmis: (brand: string) =>
    queryOptions({
      enabled: Boolean(brand),
      queryKey: [...vinOptions.all(), "wmis", brand] as const,
      queryFn: () => vinApiService.getWmis(brand),
      select: vinMapper.toWmiModels,
      staleTime: 1000 * 60 * 60 * 24,
    }),
};
