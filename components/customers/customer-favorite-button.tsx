import { Star } from "lucide-react";

export function CustomerFavoriteButton({
  favorite,
  onClick,
}: {
  favorite: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
        favorite
          ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-300"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Star className="h-4 w-4" fill={favorite ? "currentColor" : "none"} />
    </button>
  );
}
