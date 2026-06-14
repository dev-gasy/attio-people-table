export type Entrypoint = {
  id: number;
  name: string;
};

export type RuleType = "Required" | "Validation" | "Reset" | "Set";

export type Rule = {
  id: number;
  entrypointId: number;
  name: string;
  code: string;
  message: string;
  type: RuleType;
};

export const entrypoints: Entrypoint[] = [
  { id: 1, name: "Customer onboarding" },
  { id: 2, name: "Policy quote" },
  { id: 3, name: "Claim intake" },
  { id: 4, name: "Renewal review" },
  { id: 5, name: "Billing update" },
  { id: 6, name: "Profile maintenance" },
];

export const ruleTypes = [
  "Required",
  "Validation",
  "Reset",
  "Set",
] satisfies RuleType[];

const ruleTemplates = [
  {
    name: "Primary contact",
    code: "PRIMARY_CONTACT",
    message: "Primary contact details must be present before submission.",
  },
  {
    name: "Email format",
    code: "EMAIL_FORMAT",
    message: "Email addresses must use a valid mailbox format.",
  },
  {
    name: "Risk score reset",
    code: "RISK_SCORE_RESET",
    message: "Risk score is reset when underwriting inputs change.",
  },
  {
    name: "Owner assignment",
    code: "OWNER_ASSIGNMENT",
    message: "Assign the record owner from the selected service team.",
  },
  {
    name: "Effective date",
    code: "EFFECTIVE_DATE",
    message: "Effective date must be today or a future calendar date.",
  },
  {
    name: "Coverage amount",
    code: "COVERAGE_AMOUNT",
    message: "Coverage amount must be within the configured product range.",
  },
  {
    name: "Consent required",
    code: "CONSENT_REQUIRED",
    message: "Customer consent must be captured for this workflow.",
  },
  {
    name: "Status transition",
    code: "STATUS_TRANSITION",
    message: "Status changes must follow the configured lifecycle order.",
  },
];

export const rules: Rule[] = entrypoints.flatMap((entrypoint) =>
  ruleTemplates.map((template, index) => {
    const id = (entrypoint.id - 1) * ruleTemplates.length + index + 1;

    return {
      id,
      entrypointId: entrypoint.id,
      name: `${entrypoint.name} ${template.name}`,
      code: formatRuleCode(entrypoint.name, template.name, id),
      message: template.message,
      type: ruleTypes[(entrypoint.id + index) % ruleTypes.length],
    };
  }),
);

function formatRuleCode(entrypointName: string, ruleName: string, id: number) {
  const entrypointCode = entrypointName
    .replace(/[^A-Za-z]+/g, " ")
    .trim()
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
  const ruleLetter =
    ruleName
      .replace(/[^A-Za-z]+/g, "")
      .charAt(0)
      .toUpperCase() || "X";
  const ruleNumber = String(id % 10);
  const sequence = String(id).padStart(4, "0");

  return `${entrypointCode}-${ruleLetter}${ruleNumber}-${sequence}`;
}

export type Task = {
  id: number;
  title: string;
  done: boolean;
  assignee: string;
  initial: string;
  color: string;
  due: string;
  priority: "High" | "Medium" | "Low";
};

export const tasksSeed: Task[] = [
  {
    id: 1,
    title: "Follow up with Vercel on renewal",
    done: false,
    assignee: "Julian Herbst",
    initial: "J",
    color: "bg-amber-500",
    due: "Today",
    priority: "High",
  },
  {
    id: 2,
    title: "Send proposal to Notion",
    done: false,
    assignee: "Lena Cremers",
    initial: "L",
    color: "bg-pink-600",
    due: "Tomorrow",
    priority: "High",
  },
  {
    id: 3,
    title: "Prep demo for Cursor",
    done: false,
    assignee: "Tom Holland",
    initial: "T",
    color: "bg-zinc-500",
    due: "Fri",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Review onboarding for Mercury",
    done: true,
    assignee: "Ana Gantt",
    initial: "A",
    color: "bg-emerald-500",
    due: "Yesterday",
    priority: "Medium",
  },
  {
    id: 5,
    title: "Reconnect with Loom",
    done: false,
    assignee: "Nicole Gold",
    initial: "N",
    color: "bg-pink-500",
    due: "Next week",
    priority: "Low",
  },
  {
    id: 6,
    title: "Update CRM fields for Q3",
    done: true,
    assignee: "Leon Heinrichs",
    initial: "L",
    color: "bg-blue-500",
    due: "Last week",
    priority: "Low",
  },
];

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
