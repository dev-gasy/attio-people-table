import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ListFilter } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameControls,
  PageFrameFooter,
} from "@/components/page-frame";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";
import { KrakenControls } from "@/features/kraken/components/kraken-controls";
import { KrakenRulesTable } from "@/features/kraken/components/kraken-rules-table";
import { getRuleTypeCounts } from "@/features/kraken/domain/rules";
import {
  krakenEntrypointRulesQueryOptions,
  getStaticKrakenEntrypoints,
} from "@/features/kraken/kraken-service";
import { ruleTypes } from "@/lib/workspace-data";
import { useKrakenRulesTable } from "@/features/kraken/use-kraken-rules-table";

export function KrakenPage({ entrypointName }: { entrypointName?: string }) {
  const navigate = useNavigate();
  const entrypoints = useMemo(() => getStaticKrakenEntrypoints(), []);
  const {
    data,
    error: rulesError,
    isError: isRulesError,
    isFetching: isFetchingRules,
    isPending: isLoadingRules,
    refetch: refetchRules,
  } = useQuery({
    ...krakenEntrypointRulesQueryOptions(entrypointName ?? ""),
    enabled: Boolean(entrypointName),
  });
  const rules = data?.rules ?? [];
  const entrypoint = data?.entrypoint ?? null;
  const table = useKrakenRulesTable(rules);
  const entrypointOptions = useMemo<ComboOption[]>(
    () =>
      entrypoints.map((entrypoint) => ({
        value: entrypoint.slug,
        label: entrypoint.name,
        hint: `${entrypoint.rulesCount} rules`,
      })),
    [entrypoints],
  );
  const ruleTypeCounts = useMemo(() => getRuleTypeCounts(rules), [rules]);
  const ruleTypeOptions = useMemo<ComboOption[]>(
    () =>
      ruleTypes.map((type) => ({
        value: type,
        label: type,
        hint: `${ruleTypeCounts[type]} rules`,
      })),
    [ruleTypeCounts],
  );

  function handleEntrypointChange(value: string | null) {
    if (!value || value === entrypointName) return;

    table.pagination.resetPage();
    void navigate({
      to: "/kraken/$entrypointName",
      params: { entrypointName: value },
    });
  }

  return (
    <PageFrame>
      <PageHeader
        title="Kraken"
        badge={
          entrypoint ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {entrypoint.name}
            </span>
          ) : null
        }
        actions={
          <Combobox
            options={entrypointOptions}
            value={entrypointName ?? null}
            onChange={handleEntrypointChange}
            placeholder="Entrypoint name"
            searchPlaceholder="Search entrypoint names..."
            icon={ListFilter}
            className="min-w-0 flex-1 sm:min-w-[320px] sm:max-w-[420px]"
            align="right"
            clearable={false}
          />
        }
      />

      <PageFrameControls>
        <KrakenControls
          disabled={isLoadingRules || isRulesError}
          hasEntrypoint={Boolean(entrypointName)}
          ruleTypeOptions={ruleTypeOptions}
          table={table}
        />
      </PageFrameControls>

      <PageFrameBody className="pb-8">
        <KrakenRulesTable
          entrypointName={entrypointName}
          error={rulesError}
          isError={isRulesError}
          isLoading={isLoadingRules}
          isRetrying={isFetchingRules}
          onRetry={() => {
            void refetchRules();
          }}
          table={table}
        />
      </PageFrameBody>

      {!isLoadingRules && !isRulesError && table.sortedRows.length > 0 && (
        <PageFrameFooter>
          <Pagination
            page={table.pagination.currentPage}
            pageCount={table.pagination.pageCount}
            total={table.sortedRows.length}
            pageSize={table.pagination.pageSize}
            onPageChange={table.pagination.setPage}
            onPageSizeChange={table.pagination.setPageSize}
            bordered={false}
          />
        </PageFrameFooter>
      )}
    </PageFrame>
  );
}
