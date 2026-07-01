import { type ReactNode } from "react";
import { cn } from "@/shared/utils/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={cn(
        "relative h-full min-w-0 flex-1 overflow-auto bg-background pb-16 [--page-shell-header-height:4rem] md:pb-0 md:[--page-shell-header-height:4.5rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

type PageHeaderProps = {
  title?: string;
  actions?: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({
  title,
  actions,
  badge,
  children,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 min-h-(--page-shell-header-height) border-b border-border bg-background/70 px-4 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 md:px-6 md:py-4">
      {children ?? (
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          {title && (
            <h1 className="min-w-0 truncate text-xl font-semibold text-foreground md:text-2xl">
              {title}
            </h1>
          )}
          {badge}
          {actions && (
            <div className="flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:ml-auto sm:w-auto sm:flex-1 sm:justify-end">
              {actions}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

type PageControlsProps = { children: ReactNode };

export function PageControls({ children }: PageControlsProps) {
  return (
    <div className="sticky top-(--page-shell-header-height) z-40 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 md:px-6">
      {children}
    </div>
  );
}

type PageContentProps = {
  children: ReactNode;
  className?: string;
  centered?: boolean;
};

export function PageContent({
  children,
  className,
  centered = false,
}: PageContentProps) {
  return (
    <div
      className={cn(
        "px-4 py-4 md:px-6 md:py-6",
        centered &&
          "flex min-h-[calc(100vh-var(--page-shell-header-height))] items-center justify-center pb-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

type PageFooterProps = { children: ReactNode };

export function PageFooter({ children }: PageFooterProps) {
  return (
    <footer className="sticky bottom-0 z-20 border-t border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {children}
    </footer>
  );
}
