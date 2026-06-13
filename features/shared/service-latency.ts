export const SERVICE_LATENCY_MS = 600;

export function waitForServiceLatency() {
  return new Promise((resolve) => setTimeout(resolve, SERVICE_LATENCY_MS));
}
