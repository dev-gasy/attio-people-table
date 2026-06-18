import { ThemeToggle } from "@/components/theme-toggle";

export function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="mt-auto border-t border-sidebar-border px-4 py-2.75">
      {collapsed ? (
        <ThemeToggle collapsed />
      ) : (
        <div className="flex items-center gap-3">
          <div className="ml-auto">
            <ThemeToggle collapsed />
          </div>
        </div>
      )}
    </div>
  );
}
