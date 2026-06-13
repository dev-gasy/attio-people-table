import { Star } from "lucide-react";

export function Rating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          disabled={!onChange}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-4 w-4 ${
              i <= value
                ? "fill-blue-600 text-blue-600 dark:fill-blue-500 dark:text-blue-500"
                : "fill-muted text-muted"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

