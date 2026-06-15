import type { Lookup } from "@/features/lookups/lookup-mappers";

export type LookupSortKey =
  | "code"
  | "orderNo"
  | "displayValueEn"
  | "displayValueFr"
  | "effectiveDate";
export type LookupSortDirection = "asc" | "desc";

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

export function sortLookups(
  lookupList: Lookup[],
  sortKey: LookupSortKey | null,
  direction: LookupSortDirection,
) {
  if (!sortKey) return lookupList;

  return [...lookupList].sort((a, b) => {
    const result =
      getLookupSortValue(a, sortKey).localeCompare(
        getLookupSortValue(b, sortKey),
        undefined,
        { numeric: true, sensitivity: "base" },
      ) || a.id - b.id;

    return direction === "asc" ? result : -result;
  });
}

function getLookupSortValue(lookup: Lookup, sortKey: LookupSortKey) {
  if (sortKey === "effectiveDate") return lookup.effectiveDateValue;
  if (sortKey === "orderNo") return lookup.orderNo.toString();

  return lookup[sortKey];
}
