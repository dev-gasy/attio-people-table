import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  filterCustomers,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/domain/customers-list";
import { useCustomerSearchStore } from "@/features/customers/stores/customer-search-store";
import { customersQueryOptions } from "@/features/customers/data/customer-service";
import { useCustomerFavorites } from "@/features/customers/hooks/use-customer-favorites";
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
  const searchInFlightRef = useRef(false);
  const [isSearching, setIsSearching] = useState(false);
  const customers = useMemo(() => query.data ?? [], [query.data]);
  const visibleCustomers = useMemo(() => {
    if (mode === "favorites") {
      return customers.filter((customer) =>
        favorites.favoriteIdSet.has(customer.id),
      );
    }

    return filterCustomers(customers, searchValues);
  }, [customers, favorites.favoriteIdSet, mode, searchValues]);

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

  return {
    favorites,
    handleResetSearch,
    handleSearch,
    isSearching,
    query,
    searchValues,
    shouldLoadCustomers,
    visibleCustomers,
  };
}
