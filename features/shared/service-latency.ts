import {
  serviceSimulationConfig,
  type ServiceSimulationRoute,
} from "@/features/shared/service-simulation-config";

export const SERVICE_LATENCY_MS = 600;

export async function simulateServiceResponse(
  routeKey: ServiceSimulationRoute,
): Promise<Response | null> {
  const config = serviceSimulationConfig[routeKey];

  if (!config.enabled) return null;

  await waitForServiceLatency(config.latencyMs);

  if (config.failure?.enabled) {
    return Response.json(
      { message: config.failure.message },
      {
        status: config.failure.status,
        statusText: config.failure.statusText,
      },
    );
  }

  return null;
}

export function waitForServiceLatency(latencyMs = SERVICE_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, latencyMs));
}
