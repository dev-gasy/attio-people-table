import { createServerFn } from "@tanstack/react-start";
import { groupsSeed } from "@/features/groups/group-dtos";
import { simulateServiceCall } from "@/features/shared/service-latency";

export const getGroupsServer = createServerFn({ method: "GET" }).handler(
  async () => {
    await simulateServiceCall("groupsList");

    return groupsSeed;
  },
);
