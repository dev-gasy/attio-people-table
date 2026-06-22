import { useMemo } from "react";
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
import { EmptyView } from "@/components/empty-view";
import { ruleTypes } from "@/features/kraken/kraken-data";
import { useKrakenRulesTable } from "@/features/kraken/use-kraken-rules-table";
import {
  useKrakenEntrypointRulesQuery,
  useKrakenEntrypointsQuery,
} from "@/features/kraken/services/kraken.queries";

type KrakenPageProps = { entrypointName?: string };

export function KrakenPage({ entrypointName }: KrakenPageProps) {
  const navigate = useNavigate();
  const { data: entrypoints = [] } = useKrakenEntrypointsQuery();
  const {
    data,
    error: rulesError,
    isError: isRulesError,
    isFetching: isFetchingRules,
    isPending: isLoadingRules,
    refetch: refetchRules,
  } = useKrakenEntrypointRulesQuery(
    entrypointName ?? "",
    Boolean(entrypointName),
  );
  const rules = useMemo(() => data?.rules ?? [], [data?.rules]);
  const entrypoint = data?.entrypoint ?? null;
  const table = useKrakenRulesTable(rules);
  const entrypointOptions = useMemo<ComboOption[]>(
    () =>
      entrypoints.map((entrypoint) => ({
        value: entrypoint.slug,
        label: entrypoint.name,
      })),
    [entrypoints],
  );
  const ruleTypeOptions = useMemo<ComboOption[]>(
    () =>
      ruleTypes.map((type) => ({
        value: type,
        label: type,
      })),
    [],
  );

  function handleEntrypointChange(value: string | null) {
    if (!value || value === entrypointName) return;

    void navigate({
      to: "/kraken/$entrypointName",
      params: { entrypointName: value },
    });
  }

  const { pagination } = table;

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

      {!entrypointName ? (
        <PageFrameBody className="flex min-h-[calc(100vh-var(--page-frame-header-height))] items-center justify-center pb-8">
          <EmptyView message="Select an entrypoint name" />
        </PageFrameBody>
      ) : (
        <>
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

          {!isLoadingRules && !isRulesError && pagination.total > 0 && (
            <PageFrameFooter>
              <Pagination
                page={pagination.currentPage}
                pageCount={pagination.pageCount}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onPageChange={pagination.setPage}
                onPageSizeChange={pagination.setPageSize}
                bordered={false}
              />
            </PageFrameFooter>
          )}
        </>
      )}
    </PageFrame>
  );
}
