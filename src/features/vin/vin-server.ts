import { createServerFn } from "@tanstack/react-start";
import { ServiceResponseError } from "@/shared/utils/service-latency";
import type {
  VinApiResponseDto,
  VinBrandDto,
  VinModelDto,
  VinWmiDto,
} from "@/features/vin/services/vin.types";

const VPIC_BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";
const REQUEST_TIMEOUT_MS = 8_000;

export const getVinBrandsServer = createServerFn({ method: "GET" }).handler(
  async () => {
    const payload = await fetchVpic<VinBrandDto>(
      "/GetMakesForVehicleType/car?format=json",
    );
    return payload.Results ?? [];
  },
);

export const getVinModelsServer = createServerFn({ method: "GET" })
  .validator((data: { brand?: string; year?: string }) => data)
  .handler(async ({ data }) => {
    const brand = data.brand?.trim();
    const year = data.year?.trim();

    if (!brand || !year) {
      throw new ServiceResponseError({
        message: "Brand and year are required",
        status: 400,
        statusText: "Bad Request",
      });
    }

    const payload = await fetchVpic<VinModelDto>(
      `/GetModelsForMakeYear/make/${encodeURIComponent(brand)}/modelyear/${encodeURIComponent(year)}?format=json`,
    );
    return payload.Results ?? [];
  });

export const getVinWmisServer = createServerFn({ method: "GET" })
  .validator((data: { brand?: string }) => data)
  .handler(async ({ data }) => {
    const brand = data.brand?.trim();

    if (!brand) {
      throw new ServiceResponseError({
        message: "Brand is required",
        status: 400,
        statusText: "Bad Request",
      });
    }

    const payload = await fetchVpic<VinWmiDto>(
      `/GetWMIsForManufacturer/${encodeURIComponent(brand)}?vehicleType=car&format=json`,
    );
    return payload.Results ?? [];
  });

async function fetchVpic<TDto>(path: string): Promise<VinApiResponseDto<TDto>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${VPIC_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ServiceResponseError({
        message: `NHTSA vPIC request failed: ${response.status} ${response.statusText}`,
        status: response.status,
        statusText: response.statusText,
      });
    }

    return (await response.json()) as VinApiResponseDto<TDto>;
  } catch (error) {
    if (error instanceof ServiceResponseError) throw error;

    throw new ServiceResponseError({
      message:
        error instanceof Error && error.name === "AbortError"
          ? "NHTSA vPIC request timed out"
          : "Unable to reach NHTSA vPIC",
      status: 502,
      statusText: "Bad Gateway",
    });
  } finally {
    clearTimeout(timeout);
  }
}
