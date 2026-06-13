"use client";

import { useMemo, useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Mail, MapPin, Phone, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/avatar";
import {
  CustomerSearchForm,
  emptyCustomerSearchValues,
  type CustomerSearchValues,
} from "@/components/customers/customer-search-form";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/ui/pagination";
import { customersQueryOptions } from "@/features/customers/customer-service";
import {
  type Customer,
  type CustomerContactKind,
  mapCustomerDtosToCustomers,
} from "@/features/customers/customer-mappers";

const CUSTOMERS_PAGE_SIZE = 25;
const CUSTOMER_TABLE_COLUMNS =
  "grid-cols-[minmax(220px,1.35fr)_minmax(120px,170px)_minmax(140px,210px)_minmax(160px,260px)_minmax(100px,140px)]";

export function CustomersPage() {
  const { data, isPending } = useQuery(customersQueryOptions());
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

        <div className="mt-4 overflow-auto rounded-xl border border-border bg-muted/10">
          <div className="w-full min-w-0">
            <div className={`sticky top-0 z-10 grid ${CUSTOMER_TABLE_COLUMNS} border-b border-border/60 bg-background`}>
              <CustomerTableHeader icon={User} label="Customer" />
              <CustomerTableHeader icon={Phone} label="Phone" />
              <CustomerTableHeader icon={Mail} label="Email" />
              <CustomerTableHeader icon={MapPin} label="Address" />
              <CustomerTableHeader icon={CalendarDays} label="DOB" last />
            </div>

            {isPending ? (
              <CustomerTableLoadingRows />
            ) : (
              pageCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  to="/customers/$customerId"
                  params={{ customerId: String(customer.id) }}
                  className={`group grid ${CUSTOMER_TABLE_COLUMNS} border-b border-border/60 text-left hover:bg-muted/30`}
                >
                  <span className="flex min-w-0 max-w-full items-center gap-2.5 border-r border-border/60 px-4 py-2.5">
                    <Avatar
                      initial={customer.initial}
                      color={customer.color}
                    />
                    <span className="min-w-0 max-w-full truncate text-base font-semibold text-foreground">
                      {customer.name}
                    </span>
                  </span>
                  <span className="flex min-w-0 max-w-full items-center border-r border-border/60 px-4 py-2.5">
                    <PreferredContactValue customer={customer} kind="phone" />
                  </span>
                  <span className="flex min-w-0 max-w-full items-center border-r border-border/60 px-4 py-2.5">
                    <PreferredContactValue customer={customer} kind="email" />
                  </span>
                  <span className="flex min-w-0 max-w-full items-center border-r border-border/60 px-4 py-2.5">
                    <PreferredContactValue customer={customer} kind="address" />
                  </span>
                  <span className="flex min-w-0 max-w-full items-center px-4 py-2.5">
                    <span className="min-w-0 max-w-full truncate text-sm text-muted-foreground">
                      {customer.dateOfBirth}
                    </span>
                  </span>
                </Link>
              ))
            )}

            {!isPending && filteredCustomers.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No customers match your search
              </div>
            )}
          </div>
        </div>
      </div>

      {!isPending && filteredCustomers.length > 0 && (
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

function CustomerTableLoadingRows() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className={`grid ${CUSTOMER_TABLE_COLUMNS} border-b border-border/60`}
        >
          <CustomerLoadingCell widths={["h-8 w-8 rounded-full", "h-3 w-32"]} />
          <CustomerLoadingCell widths={["h-3 w-28"]} />
          <CustomerLoadingCell widths={["h-3 w-44"]} />
          <CustomerLoadingCell widths={["h-3 w-60"]} />
          <CustomerLoadingCell widths={["h-3 w-28"]} last />
        </div>
      ))}
    </>
  );
}

function PreferredContactValue({
  customer,
  kind,
}: {
  customer: Customer;
  kind: CustomerContactKind;
}) {
  const contact = customer.contacts.find(
    (item) => item.kind === kind && item.preferred,
  );

  return (
    <span
      className={`min-w-0 max-w-full truncate text-sm ${
        contact ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {contact?.value ?? "Not set"}
    </span>
  );
}

function CustomerLoadingCell({
  widths,
  last,
}: {
  widths: string[];
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 max-w-full items-center gap-2.5 px-4 py-2.5 ${
        last ? "" : "border-r border-border/60"
      }`}
    >
      {widths.map((width) => (
        <span
          key={width}
          className={`${width} block max-w-full animate-pulse bg-muted`}
        />
      ))}
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

function CustomerTableHeader({
  icon: Icon,
  label,
  last,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  last?: boolean;
}) {
  return (
    <div
      className={`min-w-0 max-w-full ${last ? "" : "border-r border-border"} px-4 py-3`}
    >
      <div className="flex min-w-0 max-w-full items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="min-w-0 max-w-full truncate">{label}</span>
      </div>
    </div>
  );
}
