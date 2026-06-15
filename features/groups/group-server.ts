import { createServerFn } from "@tanstack/react-start";
import { groupsSeed } from "@/features/groups/group-dtos";
import { createServiceSimulationMiddleware } from "@/features/shared/service-latency";

export const getGroupsServer = createServerFn({ method: "GET" })
  .middleware([createServiceSimulationMiddleware("groupsList")])
  .handler(async () => {
    return groupsSeed;
  });
