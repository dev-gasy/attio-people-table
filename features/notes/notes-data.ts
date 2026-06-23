import type { NoteDto } from "./services/notes.types";

export const notesSeed: NoteDto[] = [
  {
    id: 1,
    title: "Vercel — Renewal call notes",
    excerpt:
      "Discussed expanding seats to 600. Budget approved for Q3, waiting on procurement sign-off.",
    author: "Julian Herbst",
    updated: "2m ago",
  },
  {
    id: 2,
    title: "Cursor discovery",
    excerpt:
      "Strong product-led growth. Interested in usage-based billing and SSO. Champion is the VP Eng.",
    author: "Tom Holland",
    updated: "3h ago",
  },
  {
    id: 3,
    title: "Stripe QBR prep",
    excerpt:
      "Highlight 40% increase in connected accounts. Upsell opportunity on enterprise support tier.",
    author: "Ana Gantt",
    updated: "Yesterday",
  },
  {
    id: 4,
    title: "Figma expansion",
    excerpt:
      "Design team doubled. Pushing for org-wide rollout. Need security review docs.",
    author: "Nicole Gold",
    updated: "2 days ago",
  },
  {
    id: 5,
    title: "Notion proposal draft",
    excerpt:
      "Pricing tiers outlined. Send by Tuesday. Loop in legal for MSA redlines.",
    author: "Lena Cremers",
    updated: "3 days ago",
  },
  {
    id: 6,
    title: "Loom win-back plan",
    excerpt:
      "Churned over missing analytics. New dashboard could bring them back — schedule a check-in.",
    author: "Louis Lirou",
    updated: "1 week ago",
  },
];
