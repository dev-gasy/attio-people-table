import { getAccessibleAvatarColor } from "@/components/avatar";
import type { Person } from "@/features/people/person-mappers";

export function PersonAvatar({ person }: { person: Person }) {
  const colorClass = getAccessibleAvatarColor(person.avatarColor);

  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${colorClass}`}
    >
      {person.initial}
    </span>
  );
}
