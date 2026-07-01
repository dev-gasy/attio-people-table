import type {
  CommandNode,
  CommandSearchResult,
  CommandSearchResultGroup,
} from "@/shared/components/sidebar/command-search/types";

export function groupCommandSearchResults(
  results: CommandSearchResult[],
): CommandSearchResultGroup[] {
  const groups: CommandSearchResultGroup[] = [];

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

export function getCommandTitle(command: CommandNode) {
  return command.type === "input" && command.title
    ? command.title
    : command.name;
}

export function getCommandPlaceholder(command: CommandNode) {
  if (command.type === "input" && command.placeholder) {
    return command.placeholder;
  }

  return "Search pages and actions...";
}

export function getCommandEmptyMessage(command: CommandNode) {
  if (command.type === "input" && command.emptyMessage) {
    return command.emptyMessage;
  }

  return "No results found";
}

export function normalizeBusinessKey(value: string) {
  return value.trim().toUpperCase();
}

export function matchesCommandQuery(
  result: CommandSearchResult,
  query: string,
) {
  return `${result.label} ${result.group} ${result.keywords}`
    .toLowerCase()
    .includes(query);
}
