import { ThemeToggle } from "@/components/theme-toggle";

export function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="mt-auto border-t border-sidebar-border px-4 py-3">
      {collapsed ? (
        <ThemeToggle collapsed />
      ) : (
        <div className="flex items-center gap-3">
          <div className="ml-auto w-32">
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
