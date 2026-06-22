import type {
  CommandResult,
  CommandResultGroup,
  CommandStep,
} from "@/components/sidebar/command-search/types";

export function groupCommandResults(
  results: CommandResult[],
): CommandResultGroup[] {
  const groups: CommandResultGroup[] = [];

  results.forEach((result, index) => {
    const group = groups.find((item) => item.name === result.group);

    if (group) {
      group.results.push({ result, index });
      return;
    }

    groups.push({
      name: result.group,
      results: [{ result, index }],
    });
  });

  return groups;
}

export function getStepTitle(step: CommandStep) {
  if (step.id === "customer-field") return "Choose customer field";
  if (step.id === "customer-value") return `Search by ${step.field.label}`;
  if (step.id === "insurance-record") return `Load ${step.kind}`;
  if (step.id === "quote-revision") return "Load quote";
  if (step.id === "kraken") return "Load Kraken entrypoint";
  if (step.id === "lookups") return "Load lookup name";

  return "Command search";
}

export function getStepPlaceholder(step: CommandStep) {
  if (step.id === "customer-field") return "Choose a customer field...";
  if (step.id === "customer-value") return step.field.placeholder;
  if (step.id === "insurance-record")
    return `${step.kind.toUpperCase()}-000000`;
  if (step.id === "quote-revision") return "Revision number";
  if (step.id === "kraken") return "Search entrypoint names...";
  if (step.id === "lookups") return "Search lookup names...";

  return "Search pages and actions...";
}

export function normalizeBusinessKey(value: string) {
  return value.trim().toUpperCase();
}

export function matchesCommandQuery(result: CommandResult, query: string) {
  return `${result.label} ${result.group} ${result.keywords}`
    .toLowerCase()
    .includes(query);
}
