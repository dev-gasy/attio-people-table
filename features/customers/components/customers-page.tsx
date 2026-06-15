import { Link } from "@tanstack/react-router";
import { Download, Star, Upload, User } from "lucide-react";
import { CustomerSearchForm } from "@/features/customers/components/customer-search-form";
import { CustomerTable } from "@/features/customers/components/customer-table";
import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { Button } from "@/components/ui/button";
import {
  type CustomersPageMode,
  useCustomersPage,
} from "@/features/customers/use-customers-page";

export function CustomersPage({
  mode = "search",
}: {
  mode?: CustomersPageMode;
}) {
  const {
    favorites: { favoriteIdSet, isFavorite, toggleFavorite },
    favoritesImportError,
    handleLoadFavorites,
    handleResetSearch,
    handleSaveFavorites,
    handleSearch,
    importInputRef,
    isSearching,
    query: { error, isError, isFetching, isLoading, refetch },
    searchValues,
    shouldLoadCustomers,
    visibleCustomers,
  } = useCustomersPage({ mode });

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
