import { Avatar } from "@/shared/components/avatar";
import { PageFrameHeader } from "@/shared/components/page-frame";
import { CustomerDetailBackLink } from "@/features/customers/components/detail/customer-detail-back-link";
import { CustomerFavoriteButton } from "@/features/customers/components/shared/customer-favorite-button";
import { CustomerStatusBadge } from "@/features/customers/components/shared/customer-status-badge";
import type { Customer } from "@/features/customers/services/customers.types";

type CustomerDetailHeaderProps = {
  customer: Customer;
  favorite: boolean;
  onFavoriteToggle: () => void;
};

export function CustomerDetailHeader({
  customer,
  favorite,
  onFavoriteToggle,
}: CustomerDetailHeaderProps) {
  return (
    <PageFrameHeader>
      <div className="flex flex-wrap items-center gap-4">
        <CustomerDetailBackLink />
        <Avatar initial={customer.initial} color={customer.color} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-semibold text-foreground">
              {customer.name}
            </h1>
            <CustomerStatusBadge status={customer.status} />
            <CustomerFavoriteButton
              favorite={favorite}
              onClick={onFavoriteToggle}
            />
          </div>
        </div>
      </div>
    </PageFrameHeader>
  );
}
