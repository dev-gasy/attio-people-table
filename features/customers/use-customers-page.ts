import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  filterCustomers,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/customer-domain/customers-list";
import { useCustomerSearchStore } from "@/features/customers/customer-domain/customer-search-store";
import {
  formatCustomerFavoriteIdsJson,
  parseCustomerFavoriteIdsJson,
} from "@/features/customers/customer-domain/favorites";
import { mapCustomerDtosToCustomers } from "@/features/customers/customer-mappers";
import { customersQueryOptions } from "@/features/customers/customer-service";
import { useCustomerFavorites } from "@/features/customers/use-customer-favorites";
import { waitForServiceLatency } from "@/features/shared/service-latency";

export type CustomersPageMode = "search" | "favorites";

export function useCustomersPage({ mode }: { mode: CustomersPageMode }) {
  const navigate = useNavigate();
  const searchValues = useCustomerSearchStore((state) => state.values);
  const hasTriggeredSearch = useCustomerSearchStore(
    (state) => state.hasTriggeredSearch,
  );
  const setCustomerSearch = useCustomerSearchStore((state) => state.setSearch);
  const resetCustomerSearch = useCustomerSearchStore(
    (state) => state.resetSearch,
  );
  const shouldLoadCustomers = mode === "favorites" || hasTriggeredSearch;
  const query = useQuery({
    ...customersQueryOptions(),
    enabled: shouldLoadCustomers,
  });
  const favorites = useCustomerFavorites();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [favoritesImportError, setFavoritesImportError] = useState<
    string | null
  >(null);
  const searchInFlightRef = useRef(false);
  const [isSearching, setIsSearching] = useState(false);
  const customers = useMemo(
    () =>
      query.data
        ? mapCustomerDtosToCustomers(
            query.data.customers,
            query.data.contacts,
            query.data.products,
          )
        : [],
    [query.data],
  );
  const visibleCustomers = useMemo(() => {
    if (mode === "favorites") {
      return customers.filter((customer) =>
        favorites.favoriteIdSet.has(customer.id),
      );
    }

    return filterCustomers(customers, searchValues);
  }, [customers, favorites.favoriteIdSet, mode, searchValues]);

  useEffect(() => {
    if (mode === "search") return;

    resetCustomerSearch();
  }, [mode, resetCustomerSearch]);

  function handleSaveFavorites() {
    const blob = new Blob(
      [formatCustomerFavoriteIdsJson(favorites.favoriteIds)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "favorite-customers.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function runSyntheticCustomerSearch(applySearch: () => void) {
    if (query.isLoading || searchInFlightRef.current) return;

    searchInFlightRef.current = true;
    setIsSearching(true);

    try {
      await waitForServiceLatency();
      applySearch();
    } finally {
      searchInFlightRef.current = false;
      setIsSearching(false);
    }
  }

  async function handleSearch(values: CustomerSearchValues) {
    await runSyntheticCustomerSearch(() => {
      setCustomerSearch(trimCustomerSearchValues(values));
      void navigate({ to: "/customers" });
    });
  }

  async function handleResetSearch() {
    await runSyntheticCustomerSearch(() => {
      resetCustomerSearch();
      void navigate({ to: "/customers" });
    });
  }

  async function handleLoadFavorites(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      const result = parseCustomerFavoriteIdsJson(await file.text());

      if (!result.ok) {
        setFavoritesImportError(result.error);
        return;
      }

      favorites.setFavoriteIds(result.ids);
      setFavoritesImportError(null);
    } catch {
      setFavoritesImportError("Could not read favorites JSON.");
    }
  }

  return {
    favorites,
    favoritesImportError,
    handleLoadFavorites,
    handleResetSearch,
    handleSaveFavorites,
    handleSearch,
    importInputRef,
    isSearching,
    query,
    searchValues,
    shouldLoadCustomers,
    visibleCustomers,
  };
}
