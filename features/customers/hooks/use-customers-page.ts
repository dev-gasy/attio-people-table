import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  filterCustomers,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/domain/customers-list";
import { useCustomerSearchStore } from "@/features/customers/stores/customer-search-store";
import { useCustomerFavorites } from "@/features/customers/hooks/use-customer-favorites";
import { useCustomersQuery } from "@/features/customers/services/customers.queries";

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
  const query = useCustomersQuery(shouldLoadCustomers);
  const favorites = useCustomerFavorites();
  const customers = useMemo(() => query.data ?? [], [query.data]);
  const visibleCustomers = useMemo(() => {
    if (mode === "favorites") {
      return customers.filter((customer) =>
        favorites.favoriteIdSet.has(customer.id),
      );
    }

    return filterCustomers(customers, searchValues);
  }, [customers, favorites.favoriteIdSet, mode, searchValues]);

  async function handleSearch(values: CustomerSearchValues) {
    if (query.isLoading || query.isFetching) return false;

    if (query.data === undefined) {
      const result = await query.refetch();
      if (result.isError) return false;
    }

    setCustomerSearch(trimCustomerSearchValues(values));
    void navigate({ to: "/customers" });
    return true;
  }

  function handleResetSearch() {
    resetCustomerSearch();
    void navigate({ to: "/customers" });
  }

  return {
    favorites,
    handleResetSearch,
    handleSearch,
    query,
    searchValues,
    shouldLoadCustomers,
    visibleCustomers,
  };
}
