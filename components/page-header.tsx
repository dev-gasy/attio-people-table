import { type ReactNode } from "react";
import { PageFrameHeader } from "@/components/page-frame";

export function PageHeader({
  title,
  actions,
  badge,
}: {
  title: string;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return <PageFrameHeader title={title} actions={actions} badge={badge} />;
}
