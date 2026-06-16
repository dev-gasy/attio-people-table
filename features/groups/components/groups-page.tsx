import { GroupsContent } from "@/features/groups/components/groups-content";
import { GroupsToolbar } from "@/features/groups/components/groups-toolbar";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
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
    direction,
    draftSearch,
    filteredTotal,
    handleSort,
    pagination,
    setProvince,
    setSearch,
    setView,
    shouldLoadGroups,
    sortKey,
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
        <PageFrameBody className="pb-8">
          <DataErrorView
            title="Could not load groups"
            message={getErrorMessage(error)}
            onRetry={refetch}
            isRetrying={isFetching}
          />
        </PageFrameBody>
      ) : (
        <PageFrameBody className="pb-8">
          <GroupsContent
            filteredTotal={filteredTotal}
            activeSort={sortKey}
            direction={direction}
            idle={!shouldLoadGroups}
            isLoading={shouldLoadGroups && isPending}
            onSort={handleSort}
            rows={pagination.pageItems}
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
