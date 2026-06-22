import type {
  Lookup,
  LookupDto,
  LookupNameResponse,
  LookupNameResponseDto,
} from "./lookups.types";

const effectiveDateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export const lookupMapper = {
  toModel(dto: LookupDto): Lookup {
    return {
      ...dto,
      effectiveDate: effectiveDateFormatter.format(new Date(dto.effectiveDate)),
      effectiveDateValue: dto.effectiveDate,
    };
  },

  toModels(dtos: LookupDto[]): Lookup[] {
    return dtos.map(lookupMapper.toModel);
  },

  toDetailModel(dto: LookupNameResponseDto): LookupNameResponse {
    return {
      lookupName: dto.lookupName,
      lookups: lookupMapper.toModels(dto.lookups),
    };
  },
};
