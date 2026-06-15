import { useCallback, useMemo, useState } from "react";

import { toggleCustomerFavoriteId } from "@/features/customers/customer-domain/favorites";
import {
  getCustomerFavoriteIds,
  saveCustomerFavoriteIds,
} from "@/features/customers/customer-domain/favorites-storage";

export function useCustomerFavorites() {
  const [favoriteIdSet, setFavoriteIdSet] = useState<Set<number>>(
    () => new Set(getCustomerFavoriteIds()),
  );

  const favoriteIds = useMemo(
    () => Array.from(favoriteIdSet).sort((a, b) => a - b),
    [favoriteIdSet],
  );

  const setFavoriteIds = useCallback((nextIds: number[]) => {
    setFavoriteIdSet(new Set(saveCustomerFavoriteIds(nextIds)));
  }, []);

  const isFavorite = useCallback(
    (customerId: number) => favoriteIdSet.has(customerId),
    [favoriteIdSet],
  );

  const toggleFavorite = useCallback((customerId: number) => {
    setFavoriteIdSet((currentIdSet) => {
      const savedIds = saveCustomerFavoriteIds(
        toggleCustomerFavoriteId(customerId, Array.from(currentIdSet)),
      );

      return new Set(savedIds);
    });
  }, []);

  return {
    favoriteIds,
    favoriteIdSet,
    isFavorite,
    setFavoriteIds,
    toggleFavorite,
  };
}
