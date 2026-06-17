import type { Lookup } from "@/features/lookups/lookup-mappers";

export type LookupSortKey =
  | "code"
  | "orderNo"
  | "displayValueEn"
  | "displayValueFr"
  | "effectiveDate";

export function normalizeLookupQuery(query: string) {
  return query.trim().toLowerCase();
}

export function filterLookups({
  lookups,
  query,
}: {
  lookups: Lookup[];
  query: string;
}) {
  const normalizedQuery = normalizeLookupQuery(query);

  if (!normalizedQuery) return lookups;

  return lookups.filter((lookup) =>
    [
      lookup.code,
      lookup.orderNo.toString(),
      lookup.displayValueEn,
      lookup.displayValueFr,
    ].some((value) => value.toLowerCase().includes(normalizedQuery)),
  );
}
