import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { CustomerSearchFilter } from "@/features/customers/components/list/customer-search-filter";
import { CustomerTable } from "@/features/customers/components/list/customer-table";

import {
  PageHeader,
  PageShell,
  PageContent,
  PageFooter,
} from "@/shared/components/page-shell";
import { Pagination } from "@/shared/components/ui/pagination";

import {
  type CustomersPageMode,
  useCustomersPage,
} from "@/features/customers/hooks/use-customers-page";
import { useCustomerTable } from "@/features/customers/hooks/use-customer-table";
import { CustomerFavoritesActions } from "./customer-favorites-actions";

type CustomersPageProps = {
  mode?: CustomersPageMode;
};

export function CustomersPage({ mode = "search" }: CustomersPageProps) {
  const {
    favorites: { isFavorite, toggleFavorite },
    handleResetSearch,
    handleSearch,

    query: { error, isError, isFetching, isLoading, refetch },

    searchValues,
    shouldLoadCustomers,
    visibleCustomers,
  } = useCustomersPage({ mode });

  const table = useCustomerTable({
    customers: visibleCustomers,
    isFavorite,
    toggleFavorite,
  });

  const showPagination =
    shouldLoadCustomers &&
    !isLoading &&
    !isError &&
    table.sortedRows.length > 0;

  return (
    <PageShell>
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

      <PageContent className="flex min-h-[calc(100vh-var(--page-shell-header-height))] flex-col gap-6 pb-8">
        {mode === "search" && (
          <CustomerSearchFilter
            values={searchValues}
            disabled={isLoading || isFetching}
            onSearch={handleSearch}
            onReset={handleResetSearch}
          />
        )}

        <CustomerTable
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
      </PageContent>

      {showPagination && (
        <PageFooter>
          <Pagination
            page={table.pagination.currentPage}
            pageCount={table.pagination.pageCount}
            total={table.sortedRows.length}
            pageSize={table.pagination.pageSize}
            onPageChange={table.pagination.setPage}
            onPageSizeChange={table.pagination.setPageSize}
            bordered={false}
          />
        </PageFooter>
      )}
    </PageShell>
  );
}
