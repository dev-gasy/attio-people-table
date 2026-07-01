import { Suspense, useMemo, useTransition } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ListTree } from "lucide-react";
import { PageHeader } from "@/shared/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameControls,
  PageFrameFooter,
} from "@/shared/components/page-frame";
import { Combobox, type ComboOption } from "@/shared/components/ui/combobox";
import { Pagination } from "@/shared/components/ui/pagination";
import { LookupsControls } from "@/features/lookups/components/lookups-controls";
import { LookupsTable } from "@/features/lookups/components/lookups-table";
import { useLookupsTable } from "@/features/lookups/use-lookups-table";
import { EmptyView } from "@/shared/components/empty-view";
import {
  useLookupNameQuery,
  useLookupNamesQuery,
} from "@/features/lookups/services/lookups.queries";

type LookupsPageProps = { lookupName?: string };

export function LookupsPage({ lookupName }: LookupsPageProps) {
  const navigate = useNavigate();
  const [, startTransition] = useTransition();
  const { data: lookupNames = [] } = useLookupNamesQuery();

  const lookupNameOptions = useMemo<ComboOption[]>(
    () =>
      lookupNames.map((ln) => ({
        value: ln.slug,
        label: ln.name,
      })),
    [lookupNames],
  );

  function handleLookupNameChange(value: string | null) {
    if (!value || value === lookupName) return;

    startTransition(() => {
      void navigate({
        to: "/lookups/$lookupName",
        params: { lookupName: value },
      });
    });
  }

  return (
    <PageFrame>
      <PageHeader
        title="Lookups"
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

      {!lookupName ? (
        <PageFrameBody centered>
          <EmptyView message="Select a lookup name" />
        </PageFrameBody>
      ) : (
        <Suspense fallback={<LookupsLoadingShell />}>
          <LookupsDataLayer lookupName={lookupName} />
        </Suspense>
      )}
    </PageFrame>
  );
}

type LookupsDataLayerProps = { lookupName: string };

function LookupsDataLayer({ lookupName }: LookupsDataLayerProps) {
  const { data } = useLookupNameQuery(lookupName);
  const table = useLookupsTable(data.lookups);

  return (
    <>
      <PageFrameControls>
        <LookupsControls disabled={false} hasLookupName table={table} />
      </PageFrameControls>

      {table.sortedRows.length === 0 ? (
        <PageFrameBody centered>
          <EmptyView message="No lookups found" />
        </PageFrameBody>
      ) : (
        <>
          <PageFrameBody className="pb-8">
            <LookupsTable lookupName={lookupName} table={table} />
          </PageFrameBody>

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
        </>
      )}
    </>
  );
}

function LookupsLoadingShell() {
  return (
    <>
      <PageFrameControls>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="h-8 w-72 animate-pulse rounded-lg bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
        </div>
      </PageFrameControls>
      <PageFrameBody className="pb-8">
        <div className="overflow-auto rounded-xl border border-border bg-muted/10">
          <div className="divide-y divide-border/60">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="grid gap-4 px-4 py-3"
                style={{
                  gridTemplateColumns:
                    "minmax(220px, 0.85fr) minmax(220px, 1fr) minmax(220px, 1fr) minmax(140px, 180px) minmax(110px, 130px)",
                }}
              >
                <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
                <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="h-3 w-12 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </PageFrameBody>
    </>
  );
}
