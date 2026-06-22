export type RuleType = "Required" | "Validation" | "Reset" | "Set";

export type KrakenEntrypointDto = {
  id: number;
  name: string;
  slug: string;
  rulesCount: number;
};

export type KrakenRuleDto = {
  id: number;
  entrypointId: number;
  name: string;
  code: string;
  message: string;
  type: RuleType;
};

export type KrakenEntrypoint = KrakenEntrypointDto;
export type KrakenRule = KrakenRuleDto;

export type KrakenEntrypointRulesResponseDto = {
  entrypoint: KrakenEntrypointDto;
  rules: KrakenRuleDto[];
};

export type KrakenEntrypointRulesResponse = {
  entrypoint: KrakenEntrypoint;
  rules: KrakenRule[];
};
