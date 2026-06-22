import { fetchJson } from "@/features/shared/fetch-json";
import type { GroupDto, GroupFilters } from "./groups.types";

type JsonClient = <TData>(path: string) => Promise<TData>;

export class GroupsService {
  constructor(private readonly httpClient: JsonClient) {}

  getAll(filters: GroupFilters): Promise<GroupDto[]> {
    const params = new URLSearchParams();
    const province = filters.province?.trim();
    const search = filters.search?.trim();

    if (province) params.set("province", province);
    if (search && search.length >= 3) params.set("search", search);

    const query = params.toString();
    return this.httpClient<GroupDto[]>(
      query ? `/api/groups?${query}` : "/api/groups",
    );
  }
}

export const groupsService = new GroupsService(fetchJson);
