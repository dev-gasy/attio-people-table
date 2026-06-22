export type Note = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  initial: string;
  color: string;
  updated: string;
};

export const notes: Note[] = [
  {
    id: 1,
    title: "Vercel — Renewal call notes",
    excerpt:
      "Discussed expanding seats to 600. Budget approved for Q3, waiting on procurement sign-off.",
    author: "Julian Herbst",
    initial: "J",
    color: "bg-amber-500",
    updated: "2m ago",
  },
  {
    id: 2,
    title: "Cursor discovery",
    excerpt:
      "Strong product-led growth. Interested in usage-based billing and SSO. Champion is the VP Eng.",
    author: "Tom Holland",
    initial: "T",
    color: "bg-zinc-500",
    updated: "3h ago",
  },
  {
    id: 3,
    title: "Stripe QBR prep",
    excerpt:
      "Highlight 40% increase in connected accounts. Upsell opportunity on enterprise support tier.",
    author: "Ana Gantt",
    initial: "A",
    color: "bg-emerald-500",
    updated: "Yesterday",
  },
  {
    id: 4,
    title: "Figma expansion",
    excerpt:
      "Design team doubled. Pushing for org-wide rollout. Need security review docs.",
    author: "Nicole Gold",
    initial: "N",
    color: "bg-pink-500",
    updated: "2 days ago",
  },
  {
    id: 5,
    title: "Notion proposal draft",
    excerpt:
      "Pricing tiers outlined. Send by Tuesday. Loop in legal for MSA redlines.",
    author: "Lena Cremers",
    initial: "L",
    color: "bg-pink-600",
    updated: "3 days ago",
  },
  {
    id: 6,
    title: "Loom win-back plan",
    excerpt:
      "Churned over missing analytics. New dashboard could bring them back — schedule a check-in.",
    author: "Louis Lirou",
    initial: "L",
    color: "bg-purple-500",
    updated: "1 week ago",
  },
];
