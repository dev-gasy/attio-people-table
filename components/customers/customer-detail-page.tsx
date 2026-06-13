"use client";

import { useMemo, useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  CircleDollarSign,
  FileText,
  Home,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Avatar } from "@/components/avatar";
import { CustomerStatusBadge } from "@/components/customers/customer-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible-section";
import {
  type Customer,
  type CustomerContact,
  type CustomerContactKind,
  type CustomerProduct,
  type CustomerProductActivity,
  type CustomerProductBusinessDimension,
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

const contactSections: Array<{
  kind: CustomerContactKind;
  title: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { kind: "phone", title: "Phone list", icon: Phone },
  { kind: "email", title: "Email list", icon: Mail },
  { kind: "address", title: "Addresses", icon: Home },
];

const productTypeStyles: Record<string, string> = {
  Policy: "text-emerald-700 dark:text-emerald-300",
  Quote: "text-sky-700 dark:text-sky-300",
  Claim: "text-amber-700 dark:text-amber-300",
  Renewal: "text-purple-700 dark:text-purple-300",
};

const productFilterOptions: Array<{
  value: CustomerProductActivity | "All";
  label: string;
}> = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const businessDimensionOrder: CustomerProductBusinessDimension[] = [
  "Personal lines",
  "Commercial",
  "Life and health",
  "Claims",
  "Pipeline",
];

export function CustomerDetailPage({
  customer,
}: {
  customer: Customer | null;
}) {
  const [activeTab, setActiveTab] = useState<CustomerTab>("details");

  if (!customer) {
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

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-6 py-5">
        <BackToCustomers />
        <div className="mt-4 flex flex-wrap items-start gap-4">
          <Avatar initial={customer.initial} color={customer.color} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-semibold text-foreground">
                {customer.name}
              </h1>
              <CustomerStatusBadge status={customer.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <UserRound className="h-4 w-4" />
                {customer.owner}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                {customer.segment}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {customer.location}
              </span>
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

function BackToCustomers() {
  return (
    <Link
      to="/customers"
      className={buttonVariants({ variant: "ghost", size: "sm" })}
    >
      <ArrowLeft className="h-4 w-4" />
      Customers
    </Link>
  );
}

function DetailsTab({ customer }: { customer: Customer }) {
  const activeProducts = customer.products.filter(
    (product) => product.activity === "Active",
  );
  const inactiveProducts = customer.products.length - activeProducts.length;
  const openPipeline = customer.products.filter(
    (product) => product.type === "Quote" && product.activity === "Active",
  ).length;
  const preferredContacts = contactSections
    .map((section) => ({
      ...section,
      contact: customer.contacts.find(
        (contact) => contact.kind === section.kind && contact.preferred,
      ),
    }))
    .filter((section) => section.contact);
  const fields = [
    {
      label: "Customer ID",
      value: `CUS-${String(customer.id).padStart(4, "0")}`,
    },
    { label: "Lifecycle", value: customer.status },
    { label: "Segment", value: customer.segment },
    { label: "Owner", value: customer.owner },
    { label: "Location", value: customer.location },
    { label: "Customer since", value: customer.since },
    { label: "Lifetime value", value: customer.lifetimeValue },
    { label: "Risk", value: customer.risk },
  ];
  const metrics = [
    {
      label: "Lifetime value",
      value: customer.lifetimeValue,
      icon: CircleDollarSign,
    },
    {
      label: "Active products",
      value: String(activeProducts.length),
      icon: Package,
    },
    {
      label: "Open quotes",
      value: String(openPipeline),
      icon: Sparkles,
    },
    {
      label: "Risk",
      value: customer.risk,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="min-w-[180px] flex-1 rounded-xl border border-border bg-muted/10 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {metric.label}
                </span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 truncate text-xl font-semibold text-foreground">
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-5 xl:flex-row">
        <section className="flex-1 rounded-xl border border-border bg-muted/10 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            Account profile
          </div>
          <dl className="mt-4 flex flex-col divide-y divide-border/60">
            {fields.map((field) => (
              <div
                key={field.label}
                className="flex min-h-10 items-center gap-4 py-2 text-sm"
              >
                <dt className="w-32 shrink-0 text-muted-foreground">
                  {field.label}
                </dt>
                <dd className="min-w-0 flex-1 truncate text-foreground">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row">
        <section className="flex-1 rounded-xl border border-border bg-muted/10 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Preferred contact
          </div>
          <div className="mt-4 flex flex-col divide-y divide-border/60">
            {preferredContacts.map((section) => {
              const Icon = section.icon;
              const contact = section.contact;

              return contact ? (
                <div
                  key={section.kind}
                  className="flex min-h-11 items-center gap-4 py-2.5"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-normal text-muted-foreground">
                    {contact.label}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {contact.value}
                  </span>
                </div>
              ) : null;
            })}
          </div>
        </section>

        <section className="flex-1 rounded-xl border border-border bg-muted/10 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Package className="h-4 w-4 text-muted-foreground" />
            Product snapshot
          </div>
          <div className="mt-4 flex flex-col divide-y divide-border/60">
            {businessDimensionOrder.map((dimension) => {
              const count = customer.products.filter(
                (product) => product.businessDimension === dimension,
              ).length;

              if (count === 0) return null;

              return (
                <div
                  key={dimension}
                  className="flex min-h-10 items-center justify-between gap-4 py-2 text-sm"
                >
                  <span className="truncate text-muted-foreground">
                    {dimension}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-muted/10 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          Account notes
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-lg border border-border bg-background/40 p-3 text-sm text-muted-foreground">
            Renewal attention should focus on active policies and the highest
            value pipeline products first.
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-3 text-sm text-muted-foreground">
            Preferred outreach is already set for phone, email, and address in
            the Contacts tab.
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactsTab({ contacts }: { contacts: CustomerContact[] }) {
  const contactsByKind = useMemo(
    () =>
      contactSections.map((section) => ({
        ...section,
        contacts: contacts.filter((contact) => contact.kind === section.kind),
      })),
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
            icon={section.icon}
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
  const [activityFilter, setActivityFilter] = useState<
    CustomerProductActivity | "All"
  >("All");
  const filteredProducts = useMemo(
    () =>
      activityFilter === "All"
        ? products
        : products.filter((product) => product.activity === activityFilter),
    [activityFilter, products],
  );
  const groupedProducts = useMemo(
    () =>
      businessDimensionOrder
        .map((dimension) => ({
          dimension,
          products: filteredProducts.filter(
            (product) => product.businessDimension === dimension,
          ),
        }))
        .filter((group) => group.products.length > 0),
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
