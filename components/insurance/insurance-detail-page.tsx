"use client";

import { useMemo, useState, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CarFront,
  FileText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  getCoverageFields,
  getInsuranceSummaryFields,
  getPartyFields,
  getVehicleFields,
  type InsuranceField,
} from "@/features/insurance/insurance-domain/insurance-detail";
import { insuranceRecordQueryOptions } from "@/features/insurance/insurance-service";
import {
  mapInsuranceRecordDtoToRecord,
  type InsuranceCoverage,
  type InsuranceParty,
  type InsuranceRecord,
  type InsuranceRecordKind,
  type InsuranceVehicle,
} from "@/features/insurance/insurance-mappers";

type InsuranceTab = "details" | "parties" | "vehicles" | "coverage";

const routeLabels: Record<
  InsuranceRecordKind,
  { title: string; missing: string }
> = {
  policy: {
    title: "Policy",
    missing: "Policy not found",
  },
  quote: {
    title: "Quote",
    missing: "Quote not found",
  },
};

const tabs: Array<{
  id: InsuranceTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: "details", label: "Details", icon: FileText },
  { id: "parties", label: "Parties", icon: UserRound },
  { id: "vehicles", label: "Vehicles", icon: CarFront },
  { id: "coverage", label: "Coverage", icon: ShieldCheck },
];

export function InsuranceDetailPage({
  businessKey,
  kind,
}: {
  businessKey: string;
  kind: InsuranceRecordKind;
}) {
  const [activeTab, setActiveTab] = useState<InsuranceTab>("details");
  const { data, isPending } = useQuery(
    insuranceRecordQueryOptions(kind, businessKey),
  );
  const record = useMemo(
    () =>
      data?.record ? mapInsuranceRecordDtoToRecord(data.record) : undefined,
    [data],
  );
  const label = routeLabels[kind];

  if (isPending) {
    return <InsuranceDetailLoading />;
  }

  if (!record) {
    return <InsuranceNotFound title={label.missing} />;
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <InsuranceHeader kind={kind} record={record} />
      <InsuranceTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto px-6 py-6">
        {activeTab === "details" && <SummarySection record={record} />}
        {activeTab === "parties" && (
          <PartiesSection parties={record.parties} />
        )}
        {activeTab === "vehicles" && (
          <VehiclesSection vehicles={record.vehicles} />
        )}
        {activeTab === "coverage" && (
          <CoveragesSection coverages={record.coverages} />
        )}
      </div>
    </div>
  );
}

function InsuranceHeader({
  kind,
  record,
}: {
  kind: InsuranceRecordKind;
  record: InsuranceRecord;
}) {
  const label = routeLabels[kind];

  return (
    <div className="border-b border-border px-6 py-5">
      <div className="flex flex-wrap items-center gap-4">
        <BackToLoad />
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-semibold text-foreground">
              {label.title} {record.businessKey}
            </h1>
            <span className="inline-flex rounded-md bg-muted/60 px-2.5 py-1 text-sm text-muted-foreground">
              {record.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsuranceDetailLoading() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-6 py-5">
        <div className="flex flex-wrap items-center gap-4">
          <BackToLoad />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="h-7 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
      <InsuranceTabs activeTab="details" disabled onTabChange={() => {}} />
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 px-4 py-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-44 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsuranceNotFound({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="px-6 py-5">
        <BackToLoad />
      </div>
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This record does not exist or is no longer available.
          </p>
        </div>
      </div>
    </div>
  );
}

function InsuranceTabs({
  activeTab,
  disabled = false,
  onTabChange,
}: {
  activeTab: InsuranceTab;
  disabled?: boolean;
  onTabChange: (tab: InsuranceTab) => void;
}) {
  return (
    <div className="border-b border-border px-6">
      <div className="flex gap-1 overflow-x-auto py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              disabled={disabled}
              onClick={() => onTabChange(tab.id)}
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
  );
}

function BackToLoad() {
  return (
    <Link
      to="/load"
      aria-label="Back to load"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <ArrowLeft className="h-4 w-4" />
    </Link>
  );
}

function SummarySection({ record }: { record: InsuranceRecord }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <FieldGrid fields={getInsuranceSummaryFields(record)} />
    </div>
  );
}

function PartiesSection({ parties }: { parties: InsuranceParty[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="divide-y divide-border/60">
        {parties.map((party) => (
          <RecordBlock
            key={party.id}
            title={party.name}
            fields={getPartyFields(party)}
            icon={UserRound}
          />
        ))}
      </div>
    </div>
  );
}

function VehiclesSection({ vehicles }: { vehicles: InsuranceVehicle[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="divide-y divide-border/60">
        {vehicles.map((vehicle) => (
          <RecordBlock
            key={vehicle.id}
            title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fields={getVehicleFields(vehicle)}
            icon={CarFront}
          />
        ))}
      </div>
    </div>
  );
}

function CoveragesSection({ coverages }: { coverages: InsuranceCoverage[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="divide-y divide-border/60">
        {coverages.map((coverage) => (
          <RecordBlock
            key={coverage.id}
            title={coverage.name}
            fields={getCoverageFields(coverage)}
            icon={ShieldCheck}
          />
        ))}
      </div>
    </div>
  );
}

function RecordBlock({
  fields,
  icon: Icon,
  title,
}: {
  fields: InsuranceField[];
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="truncate">{title}</span>
      </div>
      <FieldGrid fields={fields} inset={false} />
    </div>
  );
}

function FieldGrid({
  fields,
  inset = true,
}: {
  fields: InsuranceField[];
  inset?: boolean;
}) {
  return (
    <dl
      className={`grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 ${
        inset ? "px-4 py-4" : ""
      }`}
    >
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
  );
}
