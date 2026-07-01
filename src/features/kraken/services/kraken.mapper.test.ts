import { describe, expect, it } from "vitest";
import { krakenMapper } from "./kraken.mapper";
import type {
  KrakenEntrypointDto,
  KrakenEntrypointRulesResponseDto,
  KrakenRuleDto,
} from "./kraken.types";

const entrypointDto: KrakenEntrypointDto = {
  id: 7,
  name: "Policy quote",
  slug: "policy-quote",
  rulesCount: 1,
};

const ruleDto: KrakenRuleDto = {
  id: 42,
  entrypointId: 7,
  name: "Vehicle required",
  code: "vehicle.required",
  message: "Vehicle details are required.",
  type: "Required",
};

describe("krakenMapper", () => {
  it("maps entrypoint DTOs into cloned models", () => {
    const model = krakenMapper.toEntrypointModel(entrypointDto);

    expect(model).toEqual(entrypointDto);
    expect(model).not.toBe(entrypointDto);
  });

  it("maps rules responses into cloned nested models", () => {
    const response: KrakenEntrypointRulesResponseDto = {
      entrypoint: entrypointDto,
      rules: [ruleDto],
    };

    const model = krakenMapper.toRulesResponseModel(response);

    expect(model).toEqual(response);
    expect(model.entrypoint).not.toBe(response.entrypoint);
    expect(model.rules[0]).not.toBe(response.rules[0]);
  });
});
