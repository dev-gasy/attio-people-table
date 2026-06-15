import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "@/components/data-error-view";
import { PageFrame, PageFrameBody } from "@/components/page-frame";
import { CustomerContactsTab } from "@/features/customers/components/customer-contacts-tab";
import { CustomerDetailHeader } from "@/features/customers/components/customer-detail-header";
import {
  CustomerDetailError,
  CustomerDetailLoading,
  CustomerNotFound,
} from "@/features/customers/components/customer-detail-states";
import { CustomerDetailTabs } from "@/features/customers/components/customer-detail-tabs";
import { CustomerDetailsTab } from "@/features/customers/components/customer-details-tab";
import { CustomerProductsTab } from "@/features/customers/components/customer-products-tab";
import type { CustomerTab } from "@/features/customers/components/customer-detail-constants";
import { customerQueryOptions } from "@/features/customers/customer-service";
import { useCustomerFavorites } from "@/features/customers/use-customer-favorites";
import { mapCustomerDtoToCustomer } from "@/features/customers/customer-mappers";

export function CustomerDetailPage({ customerId }: { customerId: string }) {
  const [activeTab, setActiveTab] = useState<CustomerTab>("details");
  const { isFavorite, toggleFavorite } = useCustomerFavorites();
  const numericCustomerId = Number(customerId);
  const hasValidCustomerId = Number.isFinite(numericCustomerId);
  const { data, error, isError, isFetching, isPending, refetch } = useQuery({
    ...customerQueryOptions(numericCustomerId),
    enabled: hasValidCustomerId,
  });
  const customer = useMemo(
    () =>
      data?.customer
        ? mapCustomerDtoToCustomer(data.customer, data.contacts, data.products)
        : null,
    [data],
  );

  if (!hasValidCustomerId) {
    return <CustomerNotFound />;
  }

  if (isPending) {
    return <CustomerDetailLoading />;
  }

  if (isError) {
    return (
      <CustomerDetailError
        message={getErrorMessage(error)}
        isRetrying={isFetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!customer) {
    return <CustomerNotFound />;
  }

  return (
    <PageFrame>
      <CustomerDetailHeader
        customer={customer}
        favorite={isFavorite(customer.id)}
        onFavoriteToggle={() => toggleFavorite(customer.id)}
      />
      <CustomerDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <PageFrameBody>
        {activeTab === "details" && <CustomerDetailsTab customer={customer} />}
        {activeTab === "contacts" && (
          <CustomerContactsTab contacts={customer.contacts} />
        )}
        {activeTab === "products" && (
          <CustomerProductsTab products={customer.products} />
        )}
      </PageFrameBody>
    </PageFrame>
  );
}
