export async function fetchJson<TData>(path: string): Promise<TData> {
  const response = await fetch(await resolveFetchUrl(path));

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<TData>;
}

async function resolveFetchUrl(path: string) {
  if (import.meta.env.SSR) {
    const { getRequestUrl } = await import("@tanstack/react-start/server");
    return new URL(path, getRequestUrl()).toString();
  }

  return path;
}
