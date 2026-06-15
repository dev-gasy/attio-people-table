import type { GroupStatus } from "@/features/groups/group-mappers";
import {
  groupColors,
  statusList,
  statusOptions,
} from "@/features/groups/group-mappers";

export const GROUPS_PAGE_SIZE = 16;
export { groupColors, statusList, statusOptions };

export const emptyGroupForm = {
  name: "",
  domain: "",
  status: "Prospect" as GroupStatus,
  employees: "",
  arr: "",
  location: "",
};

export type GroupForm = typeof emptyGroupForm;
