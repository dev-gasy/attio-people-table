import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/shared/components/ui/button";

export function InsuranceDetailBackLink() {
  return (
    <Link
      to="/load"
      aria-label="Back to load"
      className={buttonVariants({ variant: "ghost", size: "icon" })}
    >
      <ArrowLeft className="h-4 w-4" />
    </Link>
  );
}
