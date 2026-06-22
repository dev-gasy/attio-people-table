import type { Rule } from "@/features/kraken/kraken-data";

export type KrakenEntrypointDto = {
  id: number;
  name: string;
  slug: string;
  rulesCount: number;
};

export type KrakenEntrypointRulesResponseDto = {
  entrypoint: KrakenEntrypointDto;
  rules: Rule[];
};
