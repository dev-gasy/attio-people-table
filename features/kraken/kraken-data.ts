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

const RULES_PER_ENTRYPOINT = 100;

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
  Array.from({ length: RULES_PER_ENTRYPOINT }, (_, index) => {
    const template = ruleTemplates[index % ruleTemplates.length];
    const id = (entrypoint.id - 1) * RULES_PER_ENTRYPOINT + index + 1;
    const cycle = Math.floor(index / ruleTemplates.length);
    const nameSuffix =
      cycle === 0 ? "" : ` ${String(cycle + 1).padStart(2, "0")}`;

    return {
      id,
      entrypointId: entrypoint.id,
      name: `${entrypoint.name} ${template.name}${nameSuffix}`,
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
