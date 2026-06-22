import { type ReactNode } from "react";
import { PageFrameHeader } from "@/components/page-frame";

type PageHeaderProps = {
  title: string;
  actions?: ReactNode;
  badge?: ReactNode;
};

export function PageHeader({ title, actions, badge }: PageHeaderProps) {
  return <PageFrameHeader title={title} actions={actions} badge={badge} />;
}
