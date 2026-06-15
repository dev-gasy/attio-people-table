import { PageFrameControls } from "@/components/page-frame";
import {
  customerDetailTabs,
  type CustomerTab,
} from "@/features/customers/components/detail/customer-detail-constants";

export function CustomerDetailTabs({
  activeTab,
  disabled = false,
  onTabChange,
}: {
  activeTab: CustomerTab;
  disabled?: boolean;
  onTabChange: (tab: CustomerTab) => void;
}) {
  return (
    <PageFrameControls>
      <div className="flex gap-1 overflow-x-auto py-2">
        {customerDetailTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              disabled={disabled}
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </PageFrameControls>
  );
}
