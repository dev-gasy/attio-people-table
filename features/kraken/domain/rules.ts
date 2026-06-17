import type { Rule, RuleType } from "@/lib/workspace-data";

export type RuleSortKey = "name" | "code" | "message" | "type";

export function normalizeRuleQuery(query: string) {
  return query.trim().toLowerCase();
}

export function filterRules({
  rules,
  query,
  typeFilter,
}: {
  rules: Rule[];
  query: string;
  typeFilter: RuleType | null;
}) {
  const normalizedQuery = normalizeRuleQuery(query);

  return rules.filter((rule) => {
    const matchesType = !typeFilter || rule.type === typeFilter;
    const matchesQuery =
      !normalizedQuery ||
      [rule.name, rule.code, rule.message].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );

    return matchesType && matchesQuery;
  });
}
