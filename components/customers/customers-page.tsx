import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Download, Star, Upload, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CustomerSearchForm } from "@/components/customers/customer-search-form";
import { CustomerTable } from "@/components/customers/customer-table";
import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
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
import { customersQueryOptions } from "@/features/customers/customer-service";
import { mapCustomerDtosToCustomers } from "@/features/customers/customer-mappers";
import { useCustomerFavorites } from "@/features/customers/use-customer-favorites";
import { waitForServiceLatency } from "@/features/shared/service-latency";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type CustomersPageMode = "search" | "favorites";

export function CustomersPage({
  mode = "search",
}: {
  mode?: CustomersPageMode;
}) {
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
  const { data, error, isError, isFetching, isLoading, refetch } = useQuery({
    ...customersQueryOptions(),
    enabled: shouldLoadCustomers,
  });
  const {
    favoriteIds,
    favoriteIdSet,
    isFavorite,
    setFavoriteIds,
    toggleFavorite,
  } = useCustomerFavorites();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [favoritesImportError, setFavoritesImportError] = useState<
    string | null
  >(null);
  const searchInFlightRef = useRef(false);
  const [isSearching, setIsSearching] = useState(false);
  const customers = useMemo(
    () =>
      data
        ? mapCustomerDtosToCustomers(
            data.customers,
            data.contacts,
            data.products,
          )
        : [],
    [data],
  );
  const visibleCustomers = useMemo(() => {
    if (mode === "favorites") {
      return customers.filter((customer) => favoriteIdSet.has(customer.id));
    }

    return filterCustomers(customers, searchValues);
  }, [customers, favoriteIdSet, mode, searchValues]);

  useEffect(() => {
    if (mode === "search") return;

    resetCustomerSearch();
  }, [mode, resetCustomerSearch]);

  function handleSaveFavorites() {
    const blob = new Blob([formatCustomerFavoriteIdsJson(favoriteIds)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "favorite-customers.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function runSyntheticCustomerSearch(applySearch: () => void) {
    if (isLoading || searchInFlightRef.current) return;

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
      const trimmedValues = trimCustomerSearchValues(values);

      setCustomerSearch(trimmedValues);
      navigate({ to: "/customers" });
    });
  }

  async function handleResetSearch() {
    await runSyntheticCustomerSearch(() => {
      resetCustomerSearch();
      navigate({ to: "/customers" });
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

      setFavoriteIds(result.ids);
      setFavoritesImportError(null);
    } catch {
      setFavoritesImportError("Could not read favorites JSON.");
    }
  }

  return (
    <PageFrame>
      <PageHeader
        title={mode === "favorites" ? "Favorite Customers" : "Customers"}
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {mode === "favorites" ? (
              <>
                {favoritesImportError && (
                  <span className="text-sm text-destructive">
                    {favoritesImportError}
                  </span>
                )}
                <Link
                  to="/customers"
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <User className="h-4 w-4" />
                  All customers
                </Link>
                <input
                  ref={importInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleLoadFavorites}
                  className="hidden"
                />
                <Button onClick={() => importInputRef.current?.click()}>
                  <Upload className="h-4 w-4" />
                  Load favorites
                </Button>
                <Button onClick={handleSaveFavorites}>
                  <Download className="h-4 w-4" />
                  Save favorites
                </Button>
              </>
            ) : (
              <Link
                to="/customers/favorites"
                className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Star className="h-4 w-4" />
                Favorites
              </Link>
            )}
          </div>
        }
      />

      <PageFrameBody className="space-y-6">
        {mode === "search" && (
          <CustomerSearchForm
            values={searchValues}
            disabled={isLoading || isSearching}
            onSearch={handleSearch}
            onReset={handleResetSearch}
          />
        )}

        <CustomerTable
          customers={visibleCustomers}
          favoriteIdSet={favoriteIdSet}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          shouldLoadCustomers={shouldLoadCustomers}
          isLoading={isLoading}
          isError={isError}
          error={error}
          isRetrying={isFetching}
          idleMessage="Enter customer search criteria to load matching customers."
          emptyMessage={
            mode === "favorites"
              ? "No favorite customers saved yet."
              : "No customers match your search."
          }
          onRetry={() => {
            void refetch();
          }}
        />
      </PageFrameBody>
    </PageFrame>
  );
}
