import type { Rule, RuleType } from "@/lib/workspace-data";

export type RuleSortKey = "name" | "code" | "message" | "type";
export type RuleSortDirection = "asc" | "desc";

export function normalizeRuleQuery(query: string) {
  return query.trim().toLowerCase();
}

export function getRuleTypeCounts(rules: Rule[]) {
  return rules.reduce(
    (counts, rule) => {
      counts[rule.type] += 1;
      return counts;
    },
    {
      Required: 0,
      Validation: 0,
      Reset: 0,
      Set: 0,
    } satisfies Record<RuleType, number>,
  );
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

export function sortRules(
  ruleList: Rule[],
  sortKey: RuleSortKey | null,
  direction: RuleSortDirection,
) {
  if (!sortKey) return ruleList;

  return [...ruleList].sort((a, b) => {
    const result =
      getRuleSortValue(a, sortKey).localeCompare(
        getRuleSortValue(b, sortKey),
        undefined,
        { numeric: true, sensitivity: "base" },
      ) || a.id - b.id;

    return direction === "asc" ? result : -result;
  });
}

function getRuleSortValue(rule: Rule, sortKey: RuleSortKey) {
  return rule[sortKey];
}
