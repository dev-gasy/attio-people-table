export type ServiceSimulationRoute =
  | "customersList"
  | "customerDetail"
  | "groupsList"
  | "lookupsList"
  | "lookupNamesList"
  | "lookupNameDetail"
  | "krakenEntrypointsList"
  | "krakenEntrypointRules"
  | "policyDetail"
  | "quoteDetail";

export type ServiceFailureSimulation = {
  enabled: boolean;
  status: number;
  statusText: string;
  message: string;
};

export type ServiceSimulationConfig = {
  enabled: boolean;
  latencyMs: number;
  failure?: ServiceFailureSimulation;
};

const defaultRouteConfig = {
  enabled: true,
  latencyMs: 600,
  failure: {
    enabled: false,
    status: 503,
    statusText: "Service Unavailable",
    message: "Service is temporarily unavailable.",
  },
} satisfies ServiceSimulationConfig;

export const serviceSimulationConfig = {
  customersList: defaultRouteConfig,
  customerDetail: defaultRouteConfig,
  groupsList: {
    enabled: true,
    latencyMs: 600,
    failure: {
      enabled: false,
      status: 503,
      statusText: "Service Unavailable",
      message: "Groups service is temporarily unavailable.",
    },
  },
  lookupsList: defaultRouteConfig,
  lookupNamesList: defaultRouteConfig,
  lookupNameDetail: defaultRouteConfig,
  krakenEntrypointsList: defaultRouteConfig,
  krakenEntrypointRules: defaultRouteConfig,
  policyDetail: defaultRouteConfig,
  quoteDetail: defaultRouteConfig,
} satisfies Record<ServiceSimulationRoute, ServiceSimulationConfig>;
