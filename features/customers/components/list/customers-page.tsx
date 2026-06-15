import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { CustomerSearchForm } from "@/features/customers/components/list/customer-search-form";
import { CustomerTable } from "@/features/customers/components/list/customer-table";

import { PageHeader } from "@/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameFooter,
} from "@/components/page-frame";
import { Pagination } from "@/components/ui/pagination";

import {
  type CustomersPageMode,
  useCustomersPage,
} from "@/features/customers/hooks/use-customers-page";
import { useCustomerTable } from "@/features/customers/hooks/use-customer-table";
import { CustomerFavoritesActions } from "./customer-favorites-actions";

export function CustomersPage({
  mode = "search",
}: {
  mode?: CustomersPageMode;
}) {
  const {
    favorites: { isFavorite, toggleFavorite },
    handleResetSearch,
    handleSearch,

    isSearching,

    query: { error, isError, isFetching, isLoading, refetch },

    searchValues,
    shouldLoadCustomers,
    visibleCustomers,
  } = useCustomersPage({ mode });

  const table = useCustomerTable({
    customers: visibleCustomers,
    scope: mode,
  });

  const showPagination =
    shouldLoadCustomers &&
    !isLoading &&
    !isError &&
    table.orderedCustomers.length > 0;

  return (
    <PageFrame>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader
          title={mode === "favorites" ? "Favorite Customers" : "Customers"}
          actions={
            mode === "favorites" ? (
              <CustomerFavoritesActions />
            ) : (
              <Link
                to="/customers/favorites"
                className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Star className="h-4 w-4" />
                View favorites
              </Link>
            )
          }
        />

        <PageFrameBody className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto">
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
            table={table}
          />
        </PageFrameBody>

        {showPagination && (
          <PageFrameFooter>
            <Pagination
              page={table.pagination.currentPage}
              pageCount={table.pagination.pageCount}
              total={table.orderedCustomers.length}
              pageSize={table.pagination.pageSize}
              onPageChange={table.pagination.setPage}
              onPageSizeChange={table.pagination.setPageSize}
              bordered={false}
            />
          </PageFrameFooter>
        )}
      </div>
    </PageFrame>
  );
}
