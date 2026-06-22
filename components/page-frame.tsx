import { type ReactNode } from "react";

type PageFrameProps = { children: ReactNode };

export function PageFrame({ children }: PageFrameProps) {
  return (
    <div className="relative h-full min-w-0 flex-1 overflow-auto bg-background [--page-frame-header-height:4.5rem]">
      {children}
    </div>
  );
}

type PageFrameHeaderProps = {
  title?: string;
  actions?: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
};

export function PageFrameHeader({
  title,
  actions,
  badge,
  children,
}: PageFrameHeaderProps) {
  return (
    <header className="sticky top-0 z-50 min-h-(--page-frame-header-height) border-b border-border bg-background/70 px-6 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {children ?? (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {title && (
            <h1 className="min-w-0 truncate text-2xl font-semibold text-foreground">
              {title}
            </h1>
          )}
          {badge}
          {actions && (
            <div className="ml-auto flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

type PageFrameControlsProps = { children: ReactNode };

export function PageFrameControls({ children }: PageFrameControlsProps) {
  return (
    <div className="sticky top-(--page-frame-header-height) z-40 border-b border-border bg-background/70 px-6 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {children}
    </div>
  );
}

type PageFrameBodyProps = {
  children: ReactNode;
  className?: string;
};

export function PageFrameBody({
  children,
  className = "",
}: PageFrameBodyProps) {
  return <div className={`px-6 py-6 ${className}`}>{children}</div>;
}

type PageFrameFooterProps = { children: ReactNode };

export function PageFrameFooter({ children }: PageFrameFooterProps) {
  return (
    <footer className="sticky bottom-0 z-20 border-t border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {children}
    </footer>
  );
}
