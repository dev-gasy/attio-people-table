"use client";

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/avatar";
import {
  CustomerSearchForm,
  emptyCustomerSearchValues,
  type CustomerSearchValues,
} from "@/components/customers/customer-search-form";
import { CustomerStatusBadge } from "@/components/customers/customer-status-badge";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/ui/pagination";
import { customersQueryOptions } from "@/features/customers/customer-service";
import {
  type Customer,
  mapCustomerDtosToCustomers,
} from "@/features/customers/customer-mappers";

const CUSTOMERS_PAGE_SIZE = 25;

export function CustomersPage() {
  const { data } = useQuery(customersQueryOptions());
  const [searchValues, setSearchValues] = useState<CustomerSearchValues>(
    emptyCustomerSearchValues,
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(CUSTOMERS_PAGE_SIZE);
  const customers = useMemo(
    () =>
      data
        ? mapCustomerDtosToCustomers(data.customers, data.contacts, data.products)
        : [],
    [data],
  );
  const filteredCustomers = useMemo(
    () => filterCustomers(customers, searchValues),
    [customers, searchValues],
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
      <PageHeader title="Customers" />

      <div className="flex-1 overflow-auto px-6 pb-8">
        <CustomerSearchForm
          onSearch={(values) => {
            setSearchValues(values);
            setPage(1);
          }}
          onReset={() => {
            setSearchValues(emptyCustomerSearchValues);
            setPage(1);
          }}
        />

        {filteredCustomers.length === 0 ? (
          <div className="mt-4 py-10 text-center text-sm text-muted-foreground">
            No customers match your search
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-muted/10">
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

function filterCustomers(customers: Customer[], values: CustomerSearchValues) {
  const normalizedValues = normalizeSearchValues(values);
  const hasSearch = Object.values(normalizedValues).some(Boolean);

  if (!hasSearch) return customers;

  return customers.filter((customer) =>
    searchMatches(normalizedValues.firstName, customer.firstName) ||
    searchMatches(normalizedValues.lastName, customer.lastName) ||
    dateOfBirthMatches(normalizedValues.dateOfBirth, customer.dateOfBirth) ||
    policyQuoteMatches(normalizedValues.policyQuoteNumber, customer) ||
    contactMatches(normalizedValues.email, customer, "email") ||
    contactMatches(normalizedValues.phone, customer, "phone") ||
    contactMatches(normalizedValues.address, customer, "address"),
  );
}

function normalizeSearchValues(values: CustomerSearchValues) {
  return {
    firstName: normalize(values.firstName),
    lastName: normalize(values.lastName),
    dateOfBirth: values.dateOfBirth.trim(),
    policyQuoteNumber: normalize(values.policyQuoteNumber),
    email: normalize(values.email),
    phone: normalize(values.phone),
    address: normalize(values.address),
  };
}

function searchMatches(searchValue: string, value: string) {
  return searchValue.length > 0 && normalize(value).includes(searchValue);
}

function dateOfBirthMatches(searchValue: string, value: string) {
  return searchValue.length > 0 && value === searchValue;
}

function contactMatches(
  searchValue: string,
  customer: Customer,
  kind: "email" | "phone" | "address",
) {
  return (
    searchValue.length > 0 &&
    customer.contacts.some(
      (contact) =>
        contact.kind === kind && normalize(contact.value).includes(searchValue),
    )
  );
}

function policyQuoteMatches(searchValue: string, customer: Customer) {
  return (
    searchValue.length > 0 &&
    customer.products.some(
      (product) =>
        (product.type === "Policy" || product.type === "Quote") &&
        normalize(product.referenceNumber).includes(searchValue),
    )
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
