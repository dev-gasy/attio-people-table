import { Suspense, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ListFilter } from "lucide-react";
import { PageHeader } from "@/shared/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameControls,
  PageFrameFooter,
} from "@/shared/components/page-frame";
import { Combobox, type ComboOption } from "@/shared/components/ui/combobox";
import { Pagination } from "@/shared/components/ui/pagination";
import { KrakenControls } from "@/features/kraken/components/kraken-controls";
import { KrakenRulesTable } from "@/features/kraken/components/kraken-rules-table";
import { EmptyView } from "@/shared/components/empty-view";
import { krakenRuleTypes } from "@/features/kraken/domain/rules";
import { useKrakenRulesTable } from "@/features/kraken/use-kraken-rules-table";
import {
  useKrakenEntrypointsQuery,
  useSuspenseKrakenEntrypointRulesQuery,
} from "@/features/kraken/services/kraken.queries";

type KrakenPageProps = { entrypointName?: string };

export function KrakenPage({ entrypointName }: KrakenPageProps) {
  const navigate = useNavigate();
  const { data: entrypoints = [] } = useKrakenEntrypointsQuery();
  const entrypointOptions = useMemo<ComboOption[]>(
    () =>
      entrypoints.map((entrypoint) => ({
        value: entrypoint.slug,
        label: entrypoint.name,
      })),
    [entrypoints],
  );
  const selectedEntrypoint = useMemo(
    () =>
      entrypoints.find((entrypoint) => entrypoint.slug === entrypointName) ??
      null,
    [entrypointName, entrypoints],
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
    if (!value || value === entrypointName) return;

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
          selectedEntrypoint ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {selectedEntrypoint.name}
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
        <PageFrameBody centered>
          <EmptyView message="Select an entrypoint name" />
        </PageFrameBody>
      ) : (
        <Suspense
          fallback={
            <KrakenRulesLoadingShell
              entrypointName={entrypointName}
              ruleTypeOptions={ruleTypeOptions}
            />
          }
        >
          <KrakenRulesDataLayer
            entrypointName={entrypointName}
            ruleTypeOptions={ruleTypeOptions}
          />
        </Suspense>
      )}
    </PageFrame>
  );
}

type KrakenRulesLayerProps = {
  entrypointName: string;
  ruleTypeOptions: ComboOption[];
};

function KrakenRulesDataLayer({
  entrypointName,
  ruleTypeOptions,
}: KrakenRulesLayerProps) {
  const { data } = useSuspenseKrakenEntrypointRulesQuery(entrypointName);
  const rules = useMemo(() => data.rules, [data.rules]);
  const table = useKrakenRulesTable(rules);
  const { pagination } = table;

  return (
    <>
      <PageFrameControls>
        <KrakenControls
          disabled={false}
          hasEntrypoint
          ruleTypeOptions={ruleTypeOptions}
          table={table}
        />
      </PageFrameControls>

      {table.sortedRows.length === 0 ? (
        <PageFrameBody centered>
          <EmptyView message="No rules found" />
        </PageFrameBody>
      ) : (
        <>
          <PageFrameBody className="pb-8">
            <KrakenRulesTable
              entrypointName={entrypointName}
              error={null}
              isError={false}
              isLoading={false}
              isRetrying={false}
              onRetry={() => {}}
              table={table}
            />
          </PageFrameBody>

          {pagination.total > 0 && (
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
    </>
  );
}

function KrakenRulesLoadingShell({
  entrypointName,
  ruleTypeOptions,
}: KrakenRulesLayerProps) {
  const table = useKrakenRulesTable([]);

  return (
    <>
      <PageFrameControls>
        <KrakenControls
          disabled
          hasEntrypoint
          ruleTypeOptions={ruleTypeOptions}
          table={table}
        />
      </PageFrameControls>

      <PageFrameBody className="pb-8">
        <KrakenRulesTable
          entrypointName={entrypointName}
          error={null}
          isError={false}
          isLoading
          isRetrying={false}
          onRetry={() => {}}
          table={table}
        />
      </PageFrameBody>
    </>
  );
}
