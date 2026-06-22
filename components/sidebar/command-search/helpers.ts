import type {
  CommandConfig,
  CommandResult,
  CommandResultGroup,
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

export function getCommandTitle(command: CommandConfig) {
  return command.type === "fields" && command.title
    ? command.title
    : command.name;
}

export function getCommandPlaceholder(command: CommandConfig) {
  if (command.type === "fields" && command.placeholder) {
    return command.placeholder;
  }

  return "Search pages and actions...";
}

export function getCommandEmptyMessage(command: CommandConfig) {
  if (command.type === "fields" && command.emptyMessage) {
    return command.emptyMessage;
  }

  return "No results found";
}

export function normalizeBusinessKey(value: string) {
  return value.trim().toUpperCase();
}

export function matchesCommandQuery(result: CommandResult, query: string) {
  return `${result.label} ${result.group} ${result.keywords}`
    .toLowerCase()
    .includes(query);
}
