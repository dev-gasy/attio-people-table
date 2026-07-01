import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  PageHeader,
  PageShell,
  PageContent,
  PageControls,
  PageFooter,
} from "@/shared/components/page-shell";
import { type ComboOption } from "@/shared/components/ui/combobox";
import { Pagination } from "@/shared/components/ui/pagination";
import { KrakenControls } from "@/features/kraken/components/kraken-controls";
import {
  KrakenRulesList,
  KrakenRulesListSkeleton,
} from "@/features/kraken/components/kraken-rules-list";
import { EmptyView } from "@/shared/components/empty-view";
import { krakenRuleTypes } from "@/features/kraken/domain/rules";
import { useKrakenRulesList } from "@/features/kraken/use-kraken-rules-table";
import {
  useKrakenEntrypointsQuery,
  useKrakenEntrypointRulesQueries,
} from "@/features/kraken/services/kraken.queries";
import {
  DataErrorView,
  getErrorMessage,
} from "@/shared/components/data-error-view";

export type KrakenSearch = { entrypoint?: string };

type KrakenPageProps = { filters: KrakenSearch };

export function KrakenPage({ filters }: KrakenPageProps) {
  const navigate = useNavigate();
  const entrypointsQuery = useKrakenEntrypointsQuery();
  const entrypoints = entrypointsQuery.data ?? [];
  const ruleQueries = useKrakenEntrypointRulesQueries(entrypoints);
  const entrypointFilter = filters.entrypoint ?? null;
  const entrypointOptions = useMemo<ComboOption[]>(
    () =>
      entrypoints.map((entrypoint) => ({
        value: entrypoint.name,
        label: entrypoint.name,
        hint: `${entrypoint.rulesCount} rules`,
      })),
    [entrypoints],
  );
  const ruleTypeOptions = useMemo<ComboOption[]>(
    () =>
      krakenRuleTypes.map((type) => ({
        value: type,
        label: type,
      })),
    [],
  );

  function handleEntrypointChange(value: string | null) {
    if (value === entrypointFilter) return;

    void navigate({
      to: "/kraken",
      search: { entrypoint: value ?? undefined },
    });
  }

  const ruleItems = ruleQueries.flatMap((query, index) => {
    const data = query.data;
    const fallbackEntrypoint = entrypoints[index];

    if (!data || !fallbackEntrypoint) return [];

    return data.rules.map((rule) => ({
      entrypoint: data.entrypoint ?? fallbackEntrypoint,
      rule,
    }));
  });
  const list = useKrakenRulesList({
    entrypointFilter,
    items: ruleItems,
    onEntrypointFilterChange: handleEntrypointChange,
  });
  const { pagination } = list;
  const isLoading =
    entrypointsQuery.isLoading || ruleQueries.some((query) => query.isLoading);
  const error =
    entrypointsQuery.error ??
    ruleQueries.find((query) => query.error)?.error ??
    null;
  const isError = entrypointsQuery.isError || ruleQueries.some((q) => q.isError);
  const isRetrying =
    entrypointsQuery.isFetching || ruleQueries.some((query) => query.isFetching);

  function retryAll() {
    void entrypointsQuery.refetch();
    ruleQueries.forEach((query) => {
      void query.refetch();
    });
  }

  return (
    <PageShell>
      <PageHeader title="Kraken" />
      <PageControls>
        <KrakenControls
          disabled={isLoading}
          entrypointOptions={entrypointOptions}
          list={list}
          ruleTypeOptions={ruleTypeOptions}
        />
      </PageControls>

      {isError ? (
        <PageContent centered>
          <DataErrorView
            title="Could not load rules"
            message={getErrorMessage(error)}
            onRetry={retryAll}
            isRetrying={isRetrying}
          />
        </PageContent>
      ) : isLoading ? (
        <PageContent className="pb-8">
          <KrakenRulesListSkeleton />
        </PageContent>
      ) : list.filteredItems.length === 0 ? (
        <PageContent centered>
          <EmptyView message="No rules found" />
        </PageContent>
      ) : (
        <>
          <PageContent className="pb-8">
            <KrakenRulesList items={list.pageItems} />
          </PageContent>

          {pagination.total > 0 && (
            <PageFooter>
              <Pagination
                page={pagination.currentPage}
                pageCount={pagination.pageCount}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onPageChange={pagination.setPage}
                onPageSizeChange={pagination.setPageSize}
                bordered={false}
              />
            </PageFooter>
          )}
        </>
      )}
    </PageShell>
  );
}
