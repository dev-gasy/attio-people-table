"use client";

import { useMemo, useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  FileText,
  Home,
  Mail,
  Package,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Avatar } from "@/components/avatar";
import { CustomerFavoriteButton } from "@/components/customers/customer-favorite-button";
import { CustomerStatusBadge } from "@/components/customers/customer-status-badge";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { buttonVariants } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible-section";
import {
  filterCustomerProductsByActivity,
  getCustomerContactGroups,
  getCustomerProfileFields,
  getPreferredCustomerContacts,
  groupCustomerProductsByBusinessDimension,
  type CustomerProductActivityFilter,
} from "@/features/customers/customer-domain/customer-detail";
import { customerQueryOptions } from "@/features/customers/customer-service";
import { useCustomerFavorites } from "@/features/customers/use-customer-favorites";
import {
  type Customer,
  type CustomerContact,
  type CustomerContactKind,
  type CustomerProduct,
  mapCustomerDtoToCustomer,
} from "@/features/customers/customer-mappers";

type CustomerTab = "details" | "contacts" | "products";

const tabs: Array<{
  id: CustomerTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: "details", label: "Details", icon: FileText },
  { id: "contacts", label: "Contacts", icon: Phone },
  { id: "products", label: "Products", icon: Package },
];

const contactIcons: Record<
  CustomerContactKind,
  ComponentType<{ className?: string }>
> = {
  phone: Phone,
  email: Mail,
  address: Home,
};

const productTypeStyles: Record<string, string> = {
  Policy: "text-emerald-700 dark:text-emerald-300",
  Quote: "text-sky-700 dark:text-sky-300",
  Claim: "text-amber-700 dark:text-amber-300",
  Renewal: "text-purple-700 dark:text-purple-300",
};

const productFilterOptions: Array<{
  value: CustomerProductActivityFilter;
  label: string;
}> = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function CustomerDetailPage({ customerId }: { customerId: string }) {
  const [activeTab, setActiveTab] = useState<CustomerTab>("details");
  const { isFavorite, toggleFavorite } = useCustomerFavorites();
  const numericCustomerId = Number(customerId);
  const hasValidCustomerId = Number.isFinite(numericCustomerId);
  const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    ...customerQueryOptions(numericCustomerId),
    enabled: hasValidCustomerId,
  });
  const customer = useMemo(
    () =>
      data?.customer
        ? mapCustomerDtoToCustomer(data.customer, data.contacts, data.products)
        : null,
    [data],
  );

  if (!hasValidCustomerId) {
    return <CustomerNotFound />;
  }

  if (isPending) {
    return <CustomerDetailLoading />;
  }

  if (isError) {
    return (
      <CustomerDetailError
        message={getErrorMessage(error)}
        isRetrying={isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!customer) {
    return <CustomerNotFound />;
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-6 py-5">
        <div className="flex flex-wrap items-center gap-4">
          <BackToCustomers />
          <Avatar initial={customer.initial} color={customer.color} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-semibold text-foreground">
                {customer.name}
              </h1>
              <CustomerStatusBadge status={customer.status} />
              <CustomerFavoriteButton
                favorite={isFavorite(customer.id)}
                onClick={() => toggleFavorite(customer.id)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border px-6">
        <div className="flex gap-1 overflow-x-auto py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        {activeTab === "details" && <DetailsTab customer={customer} />}
        {activeTab === "contacts" && (
          <ContactsTab contacts={customer.contacts} />
        )}
        {activeTab === "products" && (
          <ProductsTab products={customer.products} />
        )}
      </div>
    </div>
  );
}

function CustomerDetailError({
  message,
  isRetrying,
  onRetry,
}: {
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="px-6 py-5">
        <BackToCustomers />
      </div>
      <div className="flex flex-1 items-center justify-center px-6">
        <DataErrorView
          title="Could not load customer"
          message={message}
          onRetry={onRetry}
          isRetrying={isRetrying}
        />
      </div>
    </div>
  );
}

function CustomerDetailLoading() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-6 py-5">
        <div className="flex flex-wrap items-center gap-4">
          <BackToCustomers />
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-7 w-52 animate-pulse rounded bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border px-6">
        <div className="flex gap-1 overflow-x-auto py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground"
                disabled
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <section
              key={index}
              className="overflow-hidden rounded-xl border border-border"
            >
              <div className="flex items-center gap-2.5 bg-muted/30 px-4 py-3">
                <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              </div>
              <div className="border-t border-border px-4 py-4">
                <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {Array.from({ length: index === 1 ? 3 : 4 }).map(
                    (_, rowIndex) => (
                      <div key={rowIndex} className="min-w-0">
                        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-3 w-44 animate-pulse rounded bg-muted" />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomerNotFound() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="px-6 py-5">
        <BackToCustomers />
      </div>
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Customer not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This customer record does not exist or is no longer available.
          </p>
        </div>
      </div>
    </div>
  );
}

function BackToCustomers() {
  return (
    <Link
      to="/customers"
      aria-label="Back to customers"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <ArrowLeft className="h-4 w-4" />
    </Link>
  );
}

function DetailsTab({ customer }: { customer: Customer }) {
  const fields = getCustomerProfileFields(customer);
  const preferredContacts = getPreferredCustomerContacts(customer);

  return (
    <div className="flex flex-col gap-4">
      <Collapsible title="Account profile" icon={UserRound}>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 px-4 py-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="min-w-0 text-sm">
              <dt className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                {field.label}
              </dt>
              <dd className="mt-1 min-w-0 truncate text-foreground">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </Collapsible>

      <Collapsible title="Preferred contact" icon={Phone}>
        <div className="divide-y divide-border/60">
          {preferredContacts.map((section) => {
            const Icon = contactIcons[section.kind];

            return (
              <div
                key={section.kind}
                className="flex min-h-12 items-start gap-3 px-4 py-3 text-sm"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                    {section.label}
                  </div>
                  <div className="mt-1 truncate text-foreground">
                    {section.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Collapsible>

      <Collapsible title="Account notes" icon={ShieldCheck}>
        <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Renewal attention should focus on active policies and the highest
            value pipeline products first.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Preferred outreach is already set for phone, email, and address in
            the Contacts tab.
          </p>
        </div>
      </Collapsible>
    </div>
  );
}

function ContactsTab({ contacts }: { contacts: CustomerContact[] }) {
  const contactsByKind = useMemo(
    () => getCustomerContactGroups(contacts),
    [contacts],
  );

  return (
    <div className="flex flex-col gap-4">
      {contactsByKind.map((section) => {
        return (
          <Collapsible
            key={section.kind}
            title={section.title}
            count={section.contacts.length}
            icon={contactIcons[section.kind]}
          >
            <div className="divide-y divide-border/60">
              {section.contacts.map((contact) => (
                <ContactRow key={contact.id} contact={contact} />
              ))}
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}

function ContactRow({ contact }: { contact: CustomerContact }) {
  return (
    <div className="flex min-h-11 items-center gap-4 px-4 py-2.5">
      <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {contact.label}
      </span>
      <div className="min-w-0 flex-1 truncate text-sm text-foreground">
        {contact.value}
      </div>
      {contact.preferred && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <Check className="h-3 w-3" />
          Preferred
        </span>
      )}
    </div>
  );
}

function ProductsTab({ products }: { products: CustomerProduct[] }) {
  const [activityFilter, setActivityFilter] =
    useState<CustomerProductActivityFilter>("All");
  const filteredProducts = useMemo(
    () => filterCustomerProductsByActivity(products, activityFilter),
    [activityFilter, products],
  );
  const groupedProducts = useMemo(
    () => groupCustomerProductsByBusinessDimension(filteredProducts),
    [filteredProducts],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {filteredProducts.length} products
        </div>
        <div className="flex rounded-lg border border-border bg-muted/10 p-0.5">
          {productFilterOptions.map((option) => {
            const active = activityFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActivityFilter(option.value)}
                className={`h-7 rounded-md px-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {groupedProducts.length === 0 ? (
        <div className="rounded-xl border border-border py-10 text-center text-sm text-muted-foreground">
          No products match this filter
        </div>
      ) : (
        groupedProducts.map((group) => (
          <Collapsible
            key={group.dimension}
            title={group.dimension}
            count={group.products.length}
            icon={Package}
          >
            <ProductRows products={group.products} />
          </Collapsible>
        ))
      )}
    </div>
  );
}

function ProductRows({ products }: { products: CustomerProduct[] }) {
  return (
    <div>
      <div className="flex items-center gap-4 border-b border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground">
        <span className="w-20 shrink-0">Type</span>
        <span className="min-w-[180px] flex-1">Product</span>
        <span className="w-24 shrink-0">Activity</span>
        <span className="w-32 shrink-0">Status</span>
        <span className="w-32 shrink-0">Amount</span>
        <span className="w-32 shrink-0">Effective</span>
      </div>
      <div className="divide-y divide-border/60">
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductRow({ product }: { product: CustomerProduct }) {
  return (
    <div className="flex min-h-12 items-center gap-4 px-4 py-2.5 text-sm">
      <span
        className={`w-20 shrink-0 font-medium ${
          productTypeStyles[product.type] ?? "text-foreground"
        }`}
      >
        {product.type}
      </span>
      <span className="min-w-[180px] flex-1 truncate text-foreground">
        {product.name}
      </span>
      <span
        className={`w-24 shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${
          product.activity === "Active"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : "border-border bg-muted/20 text-muted-foreground"
        }`}
      >
        {product.activity}
      </span>
      <span className="w-32 shrink-0 truncate text-muted-foreground">
        {product.status}
      </span>
      <span className="w-32 shrink-0 truncate text-foreground">
        {product.amount}
      </span>
      <span className="w-32 shrink-0 truncate text-muted-foreground">
        {product.effectiveDate}
      </span>
    </div>
  );
}
