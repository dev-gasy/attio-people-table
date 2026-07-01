import { useCallback, useMemo } from "react";

import { useCustomerFavoritesStore } from "@/features/customers/stores/customer-favorites-store";

export function useCustomerFavorites() {
  const ids = useCustomerFavoritesStore((state) => state.favoriteIds);
  const setFavoriteIds = useCustomerFavoritesStore(
    (state) => state.setFavoriteIds,
  );
  const toggleFavorite = useCustomerFavoritesStore(
    (state) => state.toggleFavorite,
  );

  const favoriteIdSet = useMemo(() => new Set(ids), [ids]);

  const sortedFavoriteIds = useMemo(
    () => [...ids].sort((a, b) => a - b),
    [ids],
  );

  const isFavorite = useCallback(
    (customerId: number) => favoriteIdSet.has(customerId),
    [favoriteIdSet],
  );

  return {
    favoriteIds: sortedFavoriteIds,
    favoriteIdSet,
    isFavorite,
    setFavoriteIds,
    toggleFavorite,
  };
}
