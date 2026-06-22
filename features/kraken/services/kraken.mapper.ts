import type {
  KrakenEntrypoint,
  KrakenEntrypointDto,
  KrakenEntrypointRulesResponse,
  KrakenEntrypointRulesResponseDto,
  KrakenRule,
  KrakenRuleDto,
} from "./kraken.types";

export const krakenMapper = {
  toEntrypointModel(dto: KrakenEntrypointDto): KrakenEntrypoint {
    return { ...dto };
  },

  toRuleModel(dto: KrakenRuleDto): KrakenRule {
    return { ...dto };
  },

  toEntrypointsModel(dtos: KrakenEntrypointDto[]): KrakenEntrypoint[] {
    return dtos.map(krakenMapper.toEntrypointModel);
  },

  toRulesResponseModel(
    dto: KrakenEntrypointRulesResponseDto,
  ): KrakenEntrypointRulesResponse {
    return {
      entrypoint: krakenMapper.toEntrypointModel(dto.entrypoint),
      rules: dto.rules.map(krakenMapper.toRuleModel),
    };
  },
};
