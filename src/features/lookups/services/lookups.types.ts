export type LookupDto = {
  id: number;
  lookupName: string;
  code: string;
  orderNo: number;
  displayValueEn: string;
  displayValueFr: string;
  effectiveDate: string;
};

export type Lookup = {
  id: number;
  lookupName: string;
  code: string;
  orderNo: number;
  displayValueEn: string;
  displayValueFr: string;
  effectiveDate: string;
  effectiveDateValue: string;
};

export type LookupNameDto = {
  name: string;
  lookupsCount: number;
};

export type LookupNameResponseDto = {
  lookupName: LookupNameDto;
  lookups: LookupDto[];
};

export type LookupNameResponse = {
  lookupName: LookupNameDto;
  lookups: Lookup[];
};
