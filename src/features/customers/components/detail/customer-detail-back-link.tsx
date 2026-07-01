import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/shared/components/ui/button";

export function CustomerDetailBackLink() {
  return (
    <Link
      to="/customers"
      aria-label="Back to customers"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <ArrowLeft className="h-4 w-4" />
    </Link>
  );
}
