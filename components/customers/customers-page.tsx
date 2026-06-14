"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Download, Star, Upload, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CustomerSearchForm } from "@/components/customers/customer-search-form";
import { CustomerTable } from "@/components/customers/customer-table";
import { PageHeader } from "@/components/page-header";
import {
  emptyCustomerSearchValues,
  filterCustomers,
  trimCustomerSearchValues,
  type CustomerSearchValues,
} from "@/features/customers/customer-domain/customers-list";
import {
  formatCustomerFavoriteIdsJson,
  parseCustomerFavoriteIdsJson,
} from "@/features/customers/customer-domain/favorites";
import { customersQueryOptions } from "@/features/customers/customer-service";
import { mapCustomerDtosToCustomers } from "@/features/customers/customer-mappers";
import { useCustomerFavorites } from "@/features/customers/use-customer-favorites";
import { waitForServiceLatency } from "@/features/shared/service-latency";

type CustomersPageMode = "search" | "favorites";

export function CustomersPage({
  mode = "search",
  initialSearchValues = emptyCustomerSearchValues,
}: {
  mode?: CustomersPageMode;
  initialSearchValues?: CustomerSearchValues;
}) {
  const navigate = useNavigate();
  const initialHasSearch = hasCustomerSearchValue(initialSearchValues);
  const [hasTriggeredSearch, setHasTriggeredSearch] = useState(
    () => mode === "favorites" || initialHasSearch,
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
  const [searchValues, setSearchValues] =
    useState<CustomerSearchValues>(initialSearchValues);
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
    setSearchValues(initialSearchValues);
    setHasTriggeredSearch(
      mode === "favorites" || hasCustomerSearchValue(initialSearchValues),
    );
  }, [initialSearchValues, mode]);

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

      setHasTriggeredSearch(true);
      setSearchValues(trimmedValues);
      navigate({
        to: "/customers",
        search: compactCustomerSearchValues(trimmedValues),
      });
    });
  }

  async function handleResetSearch() {
    await runSyntheticCustomerSearch(() => {
      setHasTriggeredSearch(false);
      setSearchValues({ ...emptyCustomerSearchValues });
      navigate({ to: "/customers", search: {} });
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
    <div className="flex h-full flex-1 flex-col overflow-hidden">
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
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <Upload className="h-4 w-4" />
                  Load favorites
                </button>
                <button
                  type="button"
                  onClick={handleSaveFavorites}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  Save favorites
                </button>
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

      <div className="flex-1 overflow-auto px-6 pb-8">
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
      </div>
    </div>
  );
}

function compactCustomerSearchValues(values: CustomerSearchValues) {
  const trimmedValues = trimCustomerSearchValues(values);
  const search: Partial<CustomerSearchValues> = {};

  for (const key of Object.keys(trimmedValues) as Array<
    keyof CustomerSearchValues
  >) {
    if (trimmedValues[key]) {
      search[key] = trimmedValues[key];
    }
  }

  return search;
}

function hasCustomerSearchValue(values: CustomerSearchValues) {
  return Object.values(trimCustomerSearchValues(values)).some(Boolean);
}
