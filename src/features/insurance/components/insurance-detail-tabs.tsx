import { PageControls } from "@/shared/components/page-shell";
import {
  insuranceDetailTabs,
  type InsuranceTab,
} from "@/features/insurance/components/insurance-detail-constants";

type InsuranceDetailTabsProps = {
  activeTab: InsuranceTab;
  disabled?: boolean;
  onTabChange: (tab: InsuranceTab) => void;
};

export function InsuranceDetailTabs({
  activeTab,
  disabled = false,
  onTabChange,
}: InsuranceDetailTabsProps) {
  return (
    <PageControls>
      <div className="flex gap-1 overflow-x-auto py-2">
        {insuranceDetailTabs.map((tab) => {
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
    </PageControls>
  );
}
