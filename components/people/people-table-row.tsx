import type { Row } from "@tanstack/react-table";
import type { Person } from "@/features/people/person-mappers";
import { ConnectionCell } from "@/components/people/connection-cell";
import { PersonAvatar } from "@/components/people/person-avatar";
import { Rating } from "@/components/people/rating";

export function PeopleTableRow({ row }: { row: Row<Person> }) {
  const person = row.original;
  const isSelected = row.getIsSelected();

  return (
    <div
      className={`group grid grid-cols-[40px_1fr_1fr_1.2fr_220px] border-b border-border/60 ${
        isSelected ? "bg-primary/10" : "hover:bg-muted/30"
      }`}
    >
      <div className="flex items-center justify-center border-r border-border/60 px-2 py-2.5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={row.getToggleSelectedHandler()}
          className={`h-4 w-4 cursor-pointer accent-blue-500 ${
            isSelected ? "" : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={`Select ${person.name}`}
        />
      </div>
      <div className="flex items-center gap-2.5 border-r border-border/60 px-4 py-2.5">
        <PersonAvatar person={person} />
        <span className="text-sm text-foreground">{person.name}</span>
      </div>
      <div className="flex items-center border-r border-border/60 px-4 py-2.5">
        <span className="rounded bg-primary/15 px-2 py-0.5 text-sm text-primary">
          {person.email}
        </span>
      </div>
      <div className="flex items-center border-r border-border/60 px-4 py-2.5">
        <ConnectionCell person={person} />
      </div>
      <div className="flex items-center px-4 py-2.5">
        <Rating value={person.rating} />
      </div>
    </div>
  );
}
