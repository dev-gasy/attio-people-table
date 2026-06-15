import {
  useCallback,
  useId,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import {
  formatCustomerFavoriteIdsJson,
  parseCustomerFavoriteIdsJson,
} from "@/features/customers/domain/favorites";
import { useCustomerFavorites } from "@/features/customers/hooks/use-customer-favorites";

export function useCustomerFavoritesActions() {
  const { favoriteIds, setFavoriteIds } = useCustomerFavorites();
  const loadFavoritesInputId = useId();
  const [favoritesImportError, setFavoritesImportError] = useState<
    string | null
  >(null);

  const handleSaveFavorites = useCallback(() => {
    const blob = new Blob([formatCustomerFavoriteIdsJson(favoriteIds)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "favorite-customers.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [favoriteIds]);

  const handleLoadFavoritesKeyDown = useCallback(
    (event: KeyboardEvent<HTMLLabelElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      event.currentTarget.click();
    },
    [],
  );

  const handleLoadFavorites = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";

      if (!file) return;

      try {
        const result = parseCustomerFavoriteIdsJson(await file.text());

        if (!result.ok) {
          setFavoritesImportError(result.error);
          return;
        }

        setFavoriteIds(result.ids);
        setFavoritesImportError(null);
      } catch {
        setFavoritesImportError("Could not read favorites JSON.");
      }
    },
    [setFavoriteIds],
  );

  return {
    favoritesImportError,
    handleLoadFavoritesKeyDown,
    handleLoadFavorites,
    handleSaveFavorites,
    loadFavoritesInputId,
  };
}
