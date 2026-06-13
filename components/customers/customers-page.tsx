"use client";

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/avatar";
import { CustomerStatusBadge } from "@/components/customers/customer-status-badge";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/ui/pagination";
import { customersQueryOptions } from "@/features/customers/service";
import {
  type Customer,
  toCustomersPresentation,
} from "@/features/customers/presentation";

const CUSTOMERS_PAGE_SIZE = 25;

export function CustomersPage() {
  const { data } = useQuery(customersQueryOptions());
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(CUSTOMERS_PAGE_SIZE);
  const customers = useMemo(
    () =>
      data
        ? toCustomersPresentation(data.customers, data.contacts, data.products)
        : [],
    [data],
  );
  const filteredCustomers = useMemo(
    () => filterCustomers(customers, query),
    [customers, query],
  );
  const pageCount = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize),
  );
  const currentPage = Math.min(page, pageCount);
  const pageCustomers = useMemo(
    () =>
      filteredCustomers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [currentPage, filteredCustomers, pageSize],
  );

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Customers"
        actions={
          <div className="relative w-64 max-w-full">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search customers"
              className="h-8 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
            />
          </div>
        }
      />

      <div className="flex-1 overflow-auto px-6 pb-8">
        {filteredCustomers.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No customers match your search
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-muted/10">
            <div className="flex items-center gap-4 border-b border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span className="w-[240px] shrink-0">Customer</span>
              <span className="w-[130px] shrink-0">Status</span>
              <span className="min-w-[150px] flex-1">Segment</span>
              <span className="min-w-[140px] flex-1">Owner</span>
              <span className="w-[120px] shrink-0">Value</span>
            </div>
            {pageCustomers.map((customer) => (
              <Link
                key={customer.id}
                to="/customers/$customerId"
                params={{ customerId: String(customer.id) }}
                className="flex min-h-12 items-center gap-4 border-b border-border/60 px-4 py-2.5 text-left last:border-b-0 hover:bg-muted/30"
              >
                <span className="flex w-[240px] shrink-0 items-center gap-3">
                  <Avatar
                    initial={customer.initial}
                    color={customer.color}
                  />
                  <span className="min-w-0 truncate text-sm font-medium text-foreground">
                    {customer.name}
                  </span>
                </span>
                <span className="w-[130px] shrink-0">
                  <CustomerStatusBadge status={customer.status} />
                </span>
                <span className="min-w-[150px] flex-1 truncate text-sm text-foreground">
                  {customer.segment}
                </span>
                <span className="min-w-[140px] flex-1 truncate text-sm text-muted-foreground">
                  {customer.owner}
                </span>
                <span className="flex w-[120px] shrink-0 items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {customer.lifetimeValue}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {filteredCustomers.length > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filteredCustomers.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}

function filterCustomers(customers: Customer[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return customers;

  return customers.filter((customer) =>
    [
      customer.name,
      customer.status,
      customer.segment,
      customer.owner,
      customer.location,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}
