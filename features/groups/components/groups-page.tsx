import { AddGroupModal } from "@/features/groups/components/add-group-modal";
import { GroupsContent } from "@/features/groups/components/groups-content";
import { GroupsToolbar } from "@/features/groups/components/groups-toolbar";
import type { GroupsView } from "@/features/groups/components/types";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { PageHeader } from "@/components/page-header";
import {
  PageFrame,
  PageFrameBody,
  PageFrameFooter,
} from "@/components/page-frame";
import type { GroupStatus } from "@/features/groups/group-mappers";
import { useGroupsPage } from "@/features/groups/use-groups-page";
import { Pagination } from "@/components/ui/pagination";

export type GroupsPageSearch = {
  status?: GroupStatus;
  view: GroupsView;
  page: number;
};

export function GroupsPage() {
  const {
    addOpen,
    direction,
    filteredTotal,
    form,
    handleAdd,
    handleSort,
    pagination,
    setAddOpen,
    setForm,
    setStatusFilter,
    setView,
    sortKey,
    statusFilter,
    view,
    query: { error, isError, isFetching, isPending, refetch },
  } = useGroupsPage();

  return (
    <PageFrame>
      <PageHeader
        title="Groups"
        actions={
          <GroupsToolbar
            statusFilter={statusFilter}
            view={view}
            onAdd={() => setAddOpen(true)}
            onStatusFilterChange={setStatusFilter}
            onViewChange={setView}
          />
        }
      />

      {isError ? (
        <PageFrameBody className="pb-8">
          <DataErrorView
            title="Could not load groups"
            message={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
            isRetrying={isFetching}
          />
        </PageFrameBody>
      ) : (
        <PageFrameBody className="pb-8">
          <GroupsContent
            filteredTotal={filteredTotal}
            activeSort={sortKey}
            direction={direction}
            isLoading={isPending}
            onSort={handleSort}
            rows={pagination.pageItems}
            view={view}
          />
        </PageFrameBody>
      )}

      {!isPending && !isError && filteredTotal > 0 && (
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

      <AddGroupModal
        open={addOpen}
        form={form}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        onFormChange={setForm}
      />
    </PageFrame>
  );
}
