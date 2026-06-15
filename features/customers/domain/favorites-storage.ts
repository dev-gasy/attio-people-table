import { normalizeCustomerFavoriteIds } from "@/features/customers/domain/favorites";

const CUSTOMER_FAVORITES_STORAGE_KEY = "attio.customerFavoriteIds";

export function getCustomerFavoriteIds() {
  if (typeof window === "undefined") return [];

  try {
    return normalizeCustomerFavoriteIds(
      JSON.parse(
        window.localStorage.getItem(CUSTOMER_FAVORITES_STORAGE_KEY) ?? "[]",
      ),
    );
  } catch {
    return [];
  }
}

export function saveCustomerFavoriteIds(ids: number[]) {
  const normalizedIds = normalizeCustomerFavoriteIds(ids);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        CUSTOMER_FAVORITES_STORAGE_KEY,
        JSON.stringify(normalizedIds),
      );
    } catch {
      // Keep the UI usable if browser storage is unavailable.
    }
  }

  return normalizedIds;
}
