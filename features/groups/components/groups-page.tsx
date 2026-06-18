import { GroupsContent } from "@/features/groups/components/groups-content";
import { GroupsToolbar } from "@/features/groups/components/groups-toolbar";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { EmptyView } from "@/components/empty-view";
import { PageHeader } from "@/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameFooter,
} from "@/components/page-frame";
import {
  useGroupsPage,
  type GroupsSearch,
} from "@/features/groups/use-groups-page";
import { Pagination } from "@/components/ui/pagination";

export function GroupsPage({ filters = {} }: { filters?: GroupsSearch }) {
  const {
    draftSearch,
    filteredTotal,
    pagination,
    setProvince,
    setSearch,
    setView,
    shouldLoadGroups,
    table,
    tableGridStyle,
    visibleColumns,
    view,
    query: { error, isError, isFetching, isPending, refetch },
  } = useGroupsPage(filters);

  return (
    <PageFrame>
      <PageHeader
        title="Groups"
        actions={
          <GroupsToolbar
            province={filters.province}
            search={draftSearch}
            view={view}
            onProvinceChange={setProvince}
            onSearchChange={setSearch}
            onViewChange={setView}
          />
        }
      />

      {isError ? (
        <PageFrameBody className="flex min-h-[calc(100vh-var(--page-frame-header-height))] items-center justify-center pb-8">
          <DataErrorView
            title="Could not load groups"
            message={getErrorMessage(error)}
            onRetry={refetch}
            isRetrying={isFetching}
          />
        </PageFrameBody>
      ) : !shouldLoadGroups ? (
        <PageFrameBody className="flex min-h-[calc(100vh-var(--page-frame-header-height))] items-center justify-center pb-8">
          <EmptyView message="Select a province or enter at least 3 search characters to load groups." />
        </PageFrameBody>
      ) : shouldLoadGroups && !isPending && filteredTotal === 0 ? (
        <PageFrameBody className="flex min-h-[calc(100vh-var(--page-frame-header-height))] items-center justify-center pb-8">
          <EmptyView message="No groups match your filters" />
        </PageFrameBody>
      ) : (
        <PageFrameBody className="pb-8">
          <GroupsContent
            isLoading={shouldLoadGroups && isPending}
            pageSize={pagination.pageSize}
            rows={pagination.pageItems}
            table={table}
            tableGridStyle={tableGridStyle}
            visibleColumns={visibleColumns}
            view={view}
          />
        </PageFrameBody>
      )}

      {shouldLoadGroups && !isPending && !isError && filteredTotal > 0 && (
        <PageFrameFooter>
          <Pagination
            page={pagination.currentPage}
            pageCount={pagination.pageCount}
            total={filteredTotal}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
            bordered={false}
          />
        </PageFrameFooter>
      )}
    </PageFrame>
  );
}
