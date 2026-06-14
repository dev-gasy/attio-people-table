import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { reportGlobalError } from "@/features/shared/global-error-store";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        reportGlobalError(error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        throwOnError: true,
      },
    },
  });

  return createRouter({
    routeTree,
    context: {
      queryClient,
    },
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
