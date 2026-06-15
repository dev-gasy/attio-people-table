import { Search, Plus, FileText } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { PageHeader } from "@/components/page-header";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { Button } from "@/components/ui/button";
import { useNotesPage } from "@/features/notes/use-notes-page";

export function NotesPage() {
  const { query, rows, setQuery } = useNotesPage();

  return (
    <PageFrame>
      <PageHeader
        title="Notes"
        actions={
          <>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-44 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4" />
              New note
            </Button>
          </>
        }
      />
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
        {rows.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No notes match &ldquo;{query}&rdquo;
          </div>
        )}
      </PageFrameBody>
    </PageFrame>
  );
}
