export type CustomerFavoriteIdsJsonResult =
  | { ok: true; ids: number[] }
  | { ok: false; error: string };

export function normalizeCustomerFavoriteIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value.filter(
        (id): id is number =>
          typeof id === "number" && Number.isInteger(id) && Number.isFinite(id),
      ),
    ),
  ).sort((a, b) => a - b);
}

export function parseCustomerFavoriteIdsJson(
  text: string,
): CustomerFavoriteIdsJsonResult {
  try {
    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed)) {
      return { ok: false, error: "Favorites JSON must be an array of IDs." };
    }

    if (
      parsed.some(
        (item) =>
          typeof item !== "number" ||
          !Number.isInteger(item) ||
          !Number.isFinite(item),
      )
    ) {
      return {
        ok: false,
        error: "Favorites JSON must contain numeric IDs only.",
      };
    }

    return { ok: true, ids: normalizeCustomerFavoriteIds(parsed) };
  } catch {
    return { ok: false, error: "Could not read favorites JSON." };
  }
}

export function formatCustomerFavoriteIdsJson(ids: number[]) {
  return `${JSON.stringify(normalizeCustomerFavoriteIds(ids), null, 2)}\n`;
}

export function toggleCustomerFavoriteId(
  customerId: number,
  currentIds: number[],
) {
  const currentIdSet = new Set(normalizeCustomerFavoriteIds(currentIds));

  if (currentIdSet.has(customerId)) {
    currentIdSet.delete(customerId);
  } else {
    currentIdSet.add(customerId);
  }

  return normalizeCustomerFavoriteIds([...currentIdSet]);
}
