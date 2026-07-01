import { createIsomorphicFn } from "@tanstack/react-start";

export async function fetchJson<TData>(path: string): Promise<TData> {
  const response = await fetch(await resolveFetchUrl(path));

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<TData>;
}

const resolveFetchUrl = createIsomorphicFn()
  .server(async (path: string) => {
    const { getRequestUrl } = await import("@tanstack/react-start/server");
    try {
      return new URL(path, getRequestUrl()).toString();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("No StartEvent found")
      ) {
        return path;
      }

      throw error;
    }
  })
  .client((path) => path);
