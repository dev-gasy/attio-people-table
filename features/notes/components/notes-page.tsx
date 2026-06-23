import { FileText } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { DataErrorView, getErrorMessage } from "@/components/data-error-view";
import { EmptyView } from "@/components/empty-view";
import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { SearchBar } from "@/components/ui/search-bar";
import { useNotesPage } from "@/features/notes/use-notes-page";

export function NotesPage() {
  const {
    error,
    isError,
    isLoading,
    isRetrying,
    query,
    refetch,
    rows,
    setQuery,
  } = useNotesPage();

  return (
    <PageFrame>
      <PageHeader
        title="Notes"
        actions={
          <SearchBar
            value={query}
            onValueChange={setQuery}
            placeholder="Search notes..."
            className="w-56"
          />
        }
      />
      {isError ? (
        <DataErrorView
          title="Could not load notes"
          message={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
          isRetrying={isRetrying}
        />
      ) : isLoading ? (
        <PageFrameBody className="pb-8">
          <NotesLoadingSkeleton />
        </PageFrameBody>
      ) : rows.length === 0 ? (
        <PageFrameBody className="flex min-h-[calc(100vh-var(--page-frame-header-height))] items-center justify-center pb-8">
          <EmptyView message={`No notes match "${query}"`} />
        </PageFrameBody>
      ) : (
        <PageFrameBody className="pb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((n) => (
              <button
                key={n.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4 text-left transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <span className="text-[15px] font-medium text-foreground">
                    {n.title}
                  </span>
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {n.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3">
                  <Avatar initial={n.initial} color={n.color} />
                  <span className="text-xs text-foreground">{n.author}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {n.updated}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </PageFrameBody>
      )}
    </PageFrame>
  );
}

function NotesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-4"
        >
          <div className="h-4 w-3/4 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-muted" />
            <div className="h-3 w-5/6 rounded-full bg-muted" />
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="h-3 w-24 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
