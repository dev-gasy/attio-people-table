import {
  serviceSimulationConfig,
  type ServiceSimulationRoute,
} from "@/features/shared/service-simulation-config";

export const SERVICE_LATENCY_MS = 600;

export class ServiceResponseError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor({
    message,
    status,
    statusText,
  }: {
    message: string;
    status: number;
    statusText: string;
  }) {
    super(message);
    this.name = "ServiceResponseError";
    this.status = status;
    this.statusText = statusText;
  }
}

export async function simulateServiceResponse(
  routeKey: ServiceSimulationRoute,
): Promise<Response | null> {
  try {
    await simulateServiceCall(routeKey);
    return null;
  } catch (error) {
    if (error instanceof ServiceResponseError) {
      return serviceErrorResponse(error);
    }

    throw error;
  }
}

export async function simulateServiceCall(routeKey: ServiceSimulationRoute) {
  const config = serviceSimulationConfig[routeKey];
  if (!config.enabled) return null;

  await waitForServiceLatency(config.latencyMs);

  if (config.failure?.enabled) {
    throw new ServiceResponseError(config.failure);
  }

  return null;
}

export function serviceErrorResponse(error: ServiceResponseError) {
  return Response.json(
    { message: error.message },
    {
      status: error.status,
      statusText: error.statusText,
    },
  );
}

export function waitForServiceLatency(latencyMs = SERVICE_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, latencyMs));
}
