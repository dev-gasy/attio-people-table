import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ListTree } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameControls,
  PageFrameFooter,
} from "@/components/page-frame";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { Pagination } from "@/components/ui/pagination";
import { LookupsControls } from "@/features/lookups/components/lookups-controls";
import { LookupsTable } from "@/features/lookups/components/lookups-table";
import {
  getStaticLookupNames,
  lookupNameQueryOptions,
} from "@/features/lookups/lookup-service";
import { useLookupsTable } from "@/features/lookups/use-lookups-table";

export function LookupsPage({ lookupName }: { lookupName?: string }) {
  const navigate = useNavigate();
  const lookupNames = useMemo(() => getStaticLookupNames(), []);
  const {
    data,
    error: lookupsError,
    isError: isLookupsError,
    isFetching: isFetchingLookups,
    isPending: isLoadingLookups,
    refetch: refetchLookups,
  } = useQuery({
    ...lookupNameQueryOptions(lookupName ?? ""),
    enabled: Boolean(lookupName),
  });
  const selectedLookupName = data?.lookupName ?? null;
  const lookups = useMemo(() => data?.lookups ?? [], [data?.lookups]);
  const table = useLookupsTable(lookups);
  const lookupNameOptions = useMemo<ComboOption[]>(
    () =>
      lookupNames.map((lookupName) => ({
        value: lookupName.slug,
        label: lookupName.name,
        hint: `${lookupName.lookupsCount} lookups`,
      })),
    [lookupNames],
  );
  function handleLookupNameChange(value: string | null) {
    if (!value || value === lookupName) return;

    table.pagination.resetPage();
    void navigate({
      to: "/lookups/$lookupName",
      params: { lookupName: value },
    });
  }

  return (
    <PageFrame>
      <PageHeader
        title="Lookups"
        badge={
          selectedLookupName ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {selectedLookupName.name}
            </span>
          ) : null
        }
        actions={
          <Combobox
            options={lookupNameOptions}
            value={lookupName ?? null}
            onChange={handleLookupNameChange}
            placeholder="Lookup name"
            searchPlaceholder="Search lookup names..."
            icon={ListTree}
            className="min-w-0 flex-1 sm:min-w-[320px] sm:max-w-[420px]"
            align="right"
            clearable={false}
          />
        }
      />

      <PageFrameControls>
        <LookupsControls
          disabled={isLoadingLookups || isLookupsError}
          hasLookupName={Boolean(lookupName)}
          table={table}
        />
      </PageFrameControls>

      <PageFrameBody className="pb-8">
        <LookupsTable
          error={lookupsError}
          isError={isLookupsError}
          isLoading={isLoadingLookups}
          isRetrying={isFetchingLookups}
          lookupName={lookupName}
          onRetry={() => {
            void refetchLookups();
          }}
          table={table}
        />
      </PageFrameBody>

      {!isLoadingLookups &&
        !isLookupsError &&
        table.filteredLookups.length > 0 && (
          <PageFrameFooter>
            <Pagination
              page={table.pagination.currentPage}
              pageCount={table.pagination.pageCount}
              total={table.sortedLookups.length}
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
