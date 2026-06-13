import { companiesSeed } from "@/features/companies/company-dtos";
import { waitForServiceLatency } from "@/features/shared/service-latency";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/companies")({
  server: {
    handlers: {
      GET: async () => {
        await waitForServiceLatency();
        return Response.json(companiesSeed);
      },
    },
  },
});
