import type { ErrorComponentProps } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/page-header";
import { PageFrame, PageFrameBody } from "@/shared/components/page-frame";

type RouteErrorFallbackProps = ErrorComponentProps & { title: string };

export function RouteErrorFallback({
  error,
  reset,
  title,
}: RouteErrorFallbackProps) {
  const queryClient = useQueryClient();
  const message =
    error instanceof Error && error.message
      ? error.message
      : "Something went wrong while loading this view.";

  async function handleRetry() {
    await queryClient.resetQueries();
    reset();
  }

  return (
    <PageFrame>
      <div className="flex min-h-full flex-col">
        <PageHeader title={title} />
        <PageFrameBody className="flex min-h-0 flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-xl px-5 py-5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Could not load {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <Button
              type="button"
              onClick={handleRetry}
              className="mt-5"
              variant="outline"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </PageFrameBody>
      </div>
    </PageFrame>
  );
}
