"use client";

import { useMemo, useState } from "react";
import { ListFilter } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";
import {
  entrypoints,
  rules,
  ruleTypes,
  type Rule,
  type RuleType,
} from "@/lib/workspace-data";

const RULES_PAGE_SIZE = 16;
const RULE_TABLE_COLUMNS =
  "grid-cols-[minmax(280px,1.5fr)_minmax(130px,170px)_minmax(180px,0.65fr)_minmax(120px,150px)]";

const ruleTypeStyles: Record<RuleType, string> = {
  Required: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Validation: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Reset: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Set: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const entrypointOptions: ComboOption[] = entrypoints.map((entrypoint) => ({
  value: String(entrypoint.id),
  label: entrypoint.name,
  hint: `${rules.filter((rule) => rule.entrypointId === entrypoint.id).length} rules`,
}));

const ruleTypeOptions: ComboOption[] = ruleTypes.map((type) => ({
  value: type,
  label: type,
  hint: `${rules.filter((rule) => rule.type === type).length} rules`,
}));

export function ActivityPage() {
  const [entrypointId, setEntrypointId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(RULES_PAGE_SIZE);
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesEntrypoint =
        !entrypointId || rule.entrypointId === Number(entrypointId);
      const matchesType = !typeFilter || rule.type === typeFilter;

      return matchesEntrypoint && matchesType;
    });
  }, [entrypointId, typeFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredRules.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRules = useMemo(
    () =>
      filteredRules.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, filteredRules, pageSize],
  );

  function handleEntrypointChange(value: string | null) {
    setEntrypointId(value);
    setPage(1);
  }

  function handleTypeChange(value: string | null) {
    setTypeFilter(value);
    setPage(1);
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader title="Kraken" />

      <div className="flex flex-wrap items-end gap-3 border-y border-border px-6 py-3 text-sm text-muted-foreground">
        <div className="flex min-w-[320px] flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium">Entrypoint name</span>
          <Combobox
            options={entrypointOptions}
            value={entrypointId}
            onChange={handleEntrypointChange}
            placeholder="Entrypoint name"
            searchPlaceholder="Search entrypoint names..."
            icon={ListFilter}
            className="min-w-0 flex-1"
            align="left"
          />
        </div>
        <div className="flex w-44 flex-col gap-1.5">
          <span className="text-xs font-medium">Type</span>
          <Combobox
            options={ruleTypeOptions}
            value={typeFilter}
            onChange={handleTypeChange}
            placeholder="All types"
            searchPlaceholder="Search rule types..."
            icon={ListFilter}
            className="w-full"
            align="right"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pt-4 pb-8">
        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div className="min-w-[920px]">
            <div
              className={`sticky top-0 z-10 grid ${RULE_TABLE_COLUMNS} border-b border-border/60 bg-background text-xs font-medium text-muted-foreground`}
            >
              <RuleHeaderCell>Name</RuleHeaderCell>
              <RuleHeaderCell>Code</RuleHeaderCell>
              <RuleHeaderCell>Message</RuleHeaderCell>
              <RuleHeaderCell last>Type</RuleHeaderCell>
            </div>

            <div className="divide-y divide-border/60">
              {pageRules.map((rule) => (
                <RuleRow key={rule.id} rule={rule} />
              ))}
            </div>

            {filteredRules.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No rules found
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredRules.length > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filteredRules.length}
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

function RuleHeaderCell({
  children,
  last,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`px-4 py-2.5 ${last ? "" : "border-r border-border/60"}`}>
      {children}
    </div>
  );
}

function RuleRow({ rule }: { rule: Rule }) {
  return (
    <div className={`grid ${RULE_TABLE_COLUMNS} text-sm hover:bg-muted/30`}>
      <RuleCell>
        <span className="min-w-0 whitespace-normal break-words font-medium leading-5 text-foreground">
          {rule.name}
        </span>
      </RuleCell>
      <RuleCell>
        <code className="min-w-0 truncate rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
          {rule.code}
        </code>
      </RuleCell>
      <RuleCell>
        <span className="min-w-0 truncate text-muted-foreground">
          {rule.message}
        </span>
      </RuleCell>
      <RuleCell last>
        <span
          className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
            ruleTypeStyles[rule.type]
          }`}
        >
          {rule.type}
        </span>
      </RuleCell>
    </div>
  );
}

function RuleCell({
  children,
  last,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center px-4 py-2.5 ${
        last ? "" : "border-r border-border/60"
      }`}
    >
      {children}
    </div>
  );
}
