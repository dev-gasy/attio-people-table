import { Suspense } from "react";
import { PageShell, PageContent } from "@/shared/components/page-shell";
import { CustomerContactsTab } from "@/features/customers/components/detail/customer-contacts-tab";
import { CustomerDetailHeader } from "@/features/customers/components/detail/customer-detail-header";
import {
  CustomerDetailLoading,
  CustomerNotFound,
} from "@/features/customers/components/detail/customer-detail-states";
import { CustomerDetailTabs } from "@/features/customers/components/detail/customer-detail-tabs";
import { CustomerDetailsTab } from "@/features/customers/components/detail/customer-details-tab";
import { CustomerProductsTab } from "@/features/customers/components/detail/customer-products-tab";
import type { CustomerTab } from "@/features/customers/components/detail/customer-detail-constants";
import { useCustomerFavorites } from "@/features/customers/hooks/use-customer-favorites";
import { useSuspenseCustomerQuery } from "@/features/customers/services/customers.queries";

type CustomerDetailPageProps = {
  activeTab: CustomerTab;
  customerId: string;
  onTabChange: (tab: CustomerTab) => void;
};

export function CustomerDetailPage({
  activeTab,
  customerId,
  onTabChange,
}: CustomerDetailPageProps) {
  const numericCustomerId = Number(customerId);
  const hasValidCustomerId = Number.isFinite(numericCustomerId);

  if (!hasValidCustomerId) {
    return <CustomerNotFound />;
  }

  return (
    <Suspense fallback={<CustomerDetailLoading />}>
      <CustomerDetailDataLayer
        activeTab={activeTab}
        customerId={numericCustomerId}
        onTabChange={onTabChange}
      />
    </Suspense>
  );
}

type CustomerDetailDataLayerProps = {
  activeTab: CustomerTab;
  customerId: number;
  onTabChange: (tab: CustomerTab) => void;
};

function CustomerDetailDataLayer({
  activeTab,
  customerId,
  onTabChange,
}: CustomerDetailDataLayerProps) {
  const { isFavorite, toggleFavorite } = useCustomerFavorites();
  const { data: customer } = useSuspenseCustomerQuery(customerId);

  if (!customer) {
    return <CustomerNotFound />;
  }

  return (
    <PageShell>
      <CustomerDetailHeader
        customer={customer}
        favorite={isFavorite(customer.id)}
        onFavoriteToggle={() => toggleFavorite(customer.id)}
      />
      <CustomerDetailTabs activeTab={activeTab} onTabChange={onTabChange} />
      <PageContent>
        {activeTab === "details" && <CustomerDetailsTab customer={customer} />}
        {activeTab === "contacts" && (
          <CustomerContactsTab contacts={customer.contacts} />
        )}
        {activeTab === "products" && (
          <CustomerProductsTab products={customer.products} />
        )}
      </PageContent>
    </PageShell>
  );
}
