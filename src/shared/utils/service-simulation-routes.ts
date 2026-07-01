import type { ServiceSimulationConfig } from "@/shared/utils/service-latency";

type ApiSimulationRouteConfig = ServiceSimulationConfig & {
  path: string;
};

const defaultServiceError = {
  enabled: false,
  status: 503,
  statusText: "Service Unavailable",
  message: "Service is temporarily unavailable.",
};

export const apiSimulationRoutes = [
  {
    path: "/api/customers",
    enabled: true,
    latencyMs: 600,
    error: defaultServiceError,
  },
  {
    path: "/api/customers/:customerId",
    enabled: true,
    latencyMs: 600,
    error: defaultServiceError,
  },
  {
    path: "/api/groups",
    enabled: true,
    latencyMs: 600,
    error: {
      enabled: false,
      status: 503,
      statusText: "Service Unavailable",
      message: "Groups service is temporarily unavailable.",
    },
  },
  {
    path: "/api/lookups",
    enabled: true,
    latencyMs: 600,
    error: defaultServiceError,
  },
  {
    path: "/api/lookups/names",
    enabled: true,
    latencyMs: 600,
    error: defaultServiceError,
  },
  {
    path: "/api/lookups/names/:lookupName",
    enabled: true,
    latencyMs: 600,
    error: defaultServiceError,
  },
  {
    path: "/api/kraken/entrypoints",
    enabled: true,
    latencyMs: 600,
    error: defaultServiceError,
  },
  {
    path: "/api/kraken/entrypoints/:entrypointName/rules",
    enabled: true,
    latencyMs: 600,
    error: defaultServiceError,
  },
  {
    path: "/api/policies/:businessKey",
    enabled: true,
    latencyMs: 600,
    error: defaultServiceError,
  },
  {
    path: "/api/quotes/:businessKey",
    enabled: true,
    latencyMs: 600,
    error: defaultServiceError,
  },
] satisfies ApiSimulationRouteConfig[];

export function getApiSimulationRoute(pathname: string) {
  return apiSimulationRoutes.find((route) =>
    matchesRoute(route.path, pathname),
  );
}

function matchesRoute(routePath: string, pathname: string) {
  const routeSegments = getPathSegments(routePath);
  const pathSegments = getPathSegments(pathname);

  if (routeSegments.length !== pathSegments.length) return false;

  return routeSegments.every(
    (segment, index) =>
      segment.startsWith(":") || segment === pathSegments[index],
  );
}

function getPathSegments(path: string) {
  return path.split("/").filter(Boolean);
}
