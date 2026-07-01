import { createServerFn } from "@tanstack/react-start";
import { lookupSeed } from "@/features/lookups/lookup-dtos";
import { ServiceResponseError } from "@/shared/utils/service-latency";

export const getLookupsServer = createServerFn({ method: "GET" }).handler(
  async () => {
    return lookupSeed;
  },
);

export const getLookupNamesServer = createServerFn({ method: "GET" }).handler(
  async () => {
    return getStaticLookupNamesPayload();
  },
);

export const getLookupNameServer = createServerFn({ method: "GET" })
  .validator((data: { lookupName: string }) => data)
  .handler(async ({ data }) => {
    const lookupName = getLookupName(data.lookupName);

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
    lookupsCount: lookupSeed.filter(
      (lookup) => lookup.lookupName === lookupName,
    ).length,
  }));
}

function getLookupName(lookupName: string) {
  return Array.from(
    new Set(lookupSeed.map((lookup) => lookup.lookupName)),
  ).find((name) => name === lookupName);
}
