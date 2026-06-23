import {
  DEFAULT_INSURANCE_TAB,
  parseInsuranceTab,
  type InsuranceTab,
} from "@/features/insurance/components/insurance-detail-constants";

export type InsuranceDetailSearch = {
  tab: InsuranceTab;
};

export function validateInsuranceDetailSearch(search: {
  tab?: unknown;
}): InsuranceDetailSearch {
  return {
    tab: parseInsuranceTab(search.tab),
  };
}

export function buildInsuranceTabSearch(nextTab: InsuranceTab) {
  return {
    tab: nextTab === DEFAULT_INSURANCE_TAB ? DEFAULT_INSURANCE_TAB : nextTab,
  };
}

export function parseQuoteRevisionParams(params: {
  businessKey: string;
  revisionNumber: string;
}) {
  const revisionNumber = Number(params.revisionNumber);

  if (!Number.isFinite(revisionNumber)) return false;

  return { ...params, revisionNumber };
}

export function stringifyQuoteRevisionParams(params: {
  businessKey: string;
  revisionNumber: number;
}) {
  return {
    ...params,
    revisionNumber: String(params.revisionNumber),
  };
}
