import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Upload } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useCustomerFavoritesActions } from "@/features/customers/use-customer-favorites-actions";

export function CustomerFavoritesActions() {
  const {
    favoritesImportError,
    handleLoadFavoritesKeyDown,
    handleLoadFavorites,
    handleSaveFavorites,
    loadFavoritesInputId,
  } = useCustomerFavoritesActions();

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {favoritesImportError && (
        <span className="text-sm text-destructive">{favoritesImportError}</span>
      )}

      <Link
        to="/customers"
        className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        All customers
      </Link>

      <input
        id={loadFavoritesInputId}
        type="file"
        accept="application/json,.json"
        onChange={handleLoadFavorites}
        className="hidden"
      />

      <label
        htmlFor={loadFavoritesInputId}
        role="button"
        tabIndex={0}
        onKeyDown={handleLoadFavoritesKeyDown}
        className={buttonVariants({ className: "cursor-pointer" })}
      >
        <Upload className="h-4 w-4" />
        Load favorites
      </label>

      <Button onClick={handleSaveFavorites}>
        <Download className="h-4 w-4" />
        Save favorites
      </Button>
    </div>
  );
}
