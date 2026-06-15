import { createServerFn } from "@tanstack/react-start";
import { lookupSeed } from "@/features/lookups/lookup-dtos";
import { createSlug } from "@/features/shared/slugs";
import {
  ServiceResponseError,
  simulateServiceCall,
} from "@/features/shared/service-latency";

export const getLookupsServer = createServerFn({ method: "GET" }).handler(
  async () => {
    await simulateServiceCall("lookupsList");

    return lookupSeed;
  },
);

export const getLookupNamesServer = createServerFn({ method: "GET" }).handler(
  async () => {
    await simulateServiceCall("lookupNamesList");

    return getStaticLookupNamesPayload();
  },
);

export const getLookupNameServer = createServerFn({ method: "GET" })
  .validator((data: { lookupName: string }) => data)
  .handler(async ({ data }) => {
    await simulateServiceCall("lookupNameDetail");

    const lookupName = getLookupNameBySlug(data.lookupName);

    if (!lookupName) {
      throw new ServiceResponseError({
        message: "Lookup name not found",
        status: 404,
        statusText: "Not Found",
      });
    }

    const lookups = lookupSeed.filter(
      (lookup) => lookup.lookupName === lookupName,
    );

    return {
      lookupName: {
        name: lookupName,
        slug: createSlug(lookupName),
        lookupsCount: lookups.length,
      },
      lookups,
    };
  });

export function getStaticLookupNamesPayload() {
  const names = Array.from(
    new Set(lookupSeed.map((lookup) => lookup.lookupName)),
  );

  return names.map((lookupName) => ({
    name: lookupName,
    slug: createSlug(lookupName),
    lookupsCount: lookupSeed.filter(
      (lookup) => lookup.lookupName === lookupName,
    ).length,
  }));
}

function getLookupNameBySlug(slug: string) {
  return Array.from(
    new Set(lookupSeed.map((lookup) => lookup.lookupName)),
  ).find((name) => createSlug(name) === slug);
}
