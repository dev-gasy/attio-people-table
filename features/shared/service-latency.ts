export const SERVICE_LATENCY_MS = 600;

export type ServiceErrorSimulation = {
  enabled: boolean;
  status: number;
  statusText: string;
  message: string;
};

export type ServiceSimulationConfig = {
  enabled: boolean;
  latencyMs: number;
  error?: ServiceErrorSimulation;
};

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

export async function simulateServiceCall(config: ServiceSimulationConfig) {
  if (!config.enabled) return null;

  await waitForServiceLatency(config.latencyMs);

  if (config.error?.enabled) {
    throw new ServiceResponseError(config.error);
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
