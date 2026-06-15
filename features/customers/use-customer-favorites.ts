import { useCallback, useMemo, useSyncExternalStore } from "react";

import { customerFavoritesStore } from "./customer-favorites-store";

export function useCustomerFavorites() {
  const ids = useSyncExternalStore(
    customerFavoritesStore.subscribe,
    customerFavoritesStore.getSnapshot,
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
    setFavoriteIds: customerFavoritesStore.setFavoriteIds,
    toggleFavorite: customerFavoritesStore.toggleFavorite,
  };
}
