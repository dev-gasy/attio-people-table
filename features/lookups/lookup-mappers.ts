import type { LookupDto } from "@/features/lookups/lookup-dtos";

export type Lookup = {
  id: number;
  lookupName: string;
  code: string;
  displayValueEn: string;
  displayValueFr: string;
  effectiveDate: string;
  effectiveDateValue: string;
};

const effectiveDateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function mapLookupDtoToLookup(dto: LookupDto): Lookup {
  return {
    ...dto,
    effectiveDate: effectiveDateFormatter.format(new Date(dto.effectiveDate)),
    effectiveDateValue: dto.effectiveDate,
  };
}

export function mapLookupDtosToLookups(dtos: LookupDto[]): Lookup[] {
  return dtos.map(mapLookupDtoToLookup);
}
