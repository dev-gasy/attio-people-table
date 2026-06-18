import { Suspense } from "react";
import { GroupsContent } from "@/features/groups/components/groups-content";
import { GroupsToolbar } from "@/features/groups/components/groups-toolbar";
import { GroupsLoadingSkeleton } from "@/features/groups/components/groups-loading-skeleton";
import { EmptyView } from "@/components/empty-view";
import { PageHeader } from "@/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameFooter,
} from "@/components/page-frame";
import {
  useGroupsPage,
  useGroupsPageControls,
  type GroupsSearch,
  type GroupsPageControls,
} from "@/features/groups/use-groups-page";
import { Pagination } from "@/components/ui/pagination";

const CENTERED_BODY =
  "flex min-h-[calc(100vh-var(--page-frame-header-height))] items-center justify-center pb-8";

export function GroupsPage({ filters = {} }: { filters?: GroupsSearch }) {
  const controls = useGroupsPageControls(filters);

  return (
    <PageFrame>
      <PageHeader
        title="Groups"
        actions={
          <GroupsToolbar
            province={filters.province}
            search={controls.draftSearch}
            view={controls.view}
            onProvinceChange={controls.setProvince}
            onSearchChange={controls.setSearch}
            onViewChange={controls.setView}
          />
        }
      />

      {!controls.shouldLoadGroups ? (
        <PageFrameBody className={CENTERED_BODY}>
          <EmptyView message="Select a province or enter at least 3 search characters to load groups." />
        </PageFrameBody>
      ) : (
        <Suspense
          fallback={
            <PageFrameBody>
              <GroupsLoadingSkeleton
                pageSize={12}
                table={null as never}
                tableGridStyle={{}}
                visibleColumns={[]}
                view={controls.view}
              />
            </PageFrameBody>
          }
        >
          <GroupsDataLayer
            activeFilters={controls.activeFilters}
            controls={controls}
          />
        </Suspense>
      )}
    </PageFrame>
  );
}

function GroupsDataLayer({
  activeFilters,
  controls,
}: {
  activeFilters: GroupsSearch;
  controls: GroupsPageControls;
}) {
  const { filteredTotal, pagination, table, tableGridStyle, visibleColumns } =
    useGroupsPage(activeFilters);

  if (filteredTotal === 0) {
    return (
      <PageFrameBody className={CENTERED_BODY}>
        <EmptyView message="No groups match your filters" />
      </PageFrameBody>
    );
  }

  return (
    <>
      <PageFrameBody className="pb-8">
        <GroupsContent
          isStale={controls.isStale}
          rows={pagination.pageItems}
          table={table}
          tableGridStyle={tableGridStyle}
          visibleColumns={visibleColumns}
          view={controls.view}
        />
      </PageFrameBody>

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
    </>
  );
}
