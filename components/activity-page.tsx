"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Mail,
  CheckSquare,
  Database,
  Calendar,
  ListFilter,
} from "lucide-react";
import { Avatar } from "@/components/avatar";
import { PageHeader } from "@/components/page-header";
import { Combobox, type ComboOption } from "@/components/ui/combobox";
import { activities, type Activity } from "@/lib/workspace-data";

const typeIcon: Record<
  Activity["type"],
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  note: { icon: FileText, color: "text-sky-600 dark:text-sky-400" },
  email: { icon: Mail, color: "text-violet-600 dark:text-violet-400" },
  task: {
    icon: CheckSquare,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  record: { icon: Database, color: "text-amber-700 dark:text-amber-400" },
  meeting: { icon: Calendar, color: "text-rose-600 dark:text-rose-400" },
};

const activityTypeOptions: ComboOption[] = [
  { value: "note", label: "Notes", hint: "Notes" },
  { value: "email", label: "Emails", hint: "Mail" },
  { value: "task", label: "Tasks", hint: "Done" },
  { value: "record", label: "Records", hint: "CRM" },
  { value: "meeting", label: "Meetings", hint: "Calendar" },
];

export function ActivityPage() {
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (!typeFilter) return activities;
    return activities.filter((activity) => activity.type === typeFilter);
  }, [typeFilter]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader
        title="Activity"
        actions={
          <Combobox
            options={activityTypeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="All activity"
            searchPlaceholder="Search activity types..."
            icon={ListFilter}
            className="w-56"
            align="right"
          />
        }
      />
      <div className="flex-1 overflow-auto px-6 pb-8">
        <div className="w-full">
          <ol className="grid gap-2">
            {visible.map((a) => {
              const { icon: Icon, color } = typeIcon[a.type];
              return (
                <li
                  key={a.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 px-3.5 py-2 hover:bg-muted/30"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <Avatar initial={a.initial} color={a.color} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{a.actor}</span>{" "}
                        <span className="text-muted-foreground">
                          {a.action}
                        </span>{" "}
                        <span className="font-medium">{a.target}</span>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {visible.length === 0 && (
            <div className="rounded-lg border border-border px-4 py-10 text-center text-sm text-muted-foreground">
              No activity found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
