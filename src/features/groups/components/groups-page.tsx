import { Suspense } from "react";
import { GroupsContent } from "@/features/groups/components/groups-content";
import { GroupsToolbar } from "@/features/groups/components/groups-toolbar";
import { GroupsLoadingSkeleton } from "@/features/groups/components/groups-loading-skeleton";
import { EmptyView } from "@/shared/components/empty-view";
import { PageHeader } from "@/shared/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameFooter,
} from "@/shared/components/page-frame";
import {
  useGroupsPage,
  useGroupsPageControls,
  type GroupsSearch,
  type GroupsPageControls,
} from "@/features/groups/use-groups-page";
import type { GroupFilters } from "@/features/groups/services/groups.types";
import { Pagination } from "@/shared/components/ui/pagination";
import { DEFAULT_VIEW_MODE } from "@/shared/utils/view-mode";

type GroupsPageProps = { filters?: GroupsSearch };

export function GroupsPage({
  filters = { view: DEFAULT_VIEW_MODE },
}: GroupsPageProps) {
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
        <PageFrameBody centered>
          <EmptyView message="Search or select a province to load groups." />
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

type GroupsDataLayerProps = {
  activeFilters: GroupFilters;
  controls: GroupsPageControls;
};

function GroupsDataLayer({ activeFilters, controls }: GroupsDataLayerProps) {
  const { filteredTotal, pagination, table, tableGridStyle, visibleColumns } =
    useGroupsPage(activeFilters);

  if (filteredTotal === 0) {
    return (
      <PageFrameBody centered>
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
