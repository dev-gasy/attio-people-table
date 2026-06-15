import type { MetaDescriptor } from "@tanstack/react-router";

export const APP_NAME = "CRM Demo";

export type PageMetaOptions = {
  title: string;
  description: string;
};

export function buildPageTitle(pageTitle: string) {
  return `${pageTitle} | ${APP_NAME}`;
}

export function buildPageMeta({
  title,
  description,
}: PageMetaOptions): MetaDescriptor[] {
  const pageTitle = buildPageTitle(title);

  return [
    { title: pageTitle },
    { name: "description", content: description },
    { property: "og:site_name", content: APP_NAME },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: description },
  ];
}
