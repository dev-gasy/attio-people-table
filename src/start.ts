import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
import {
  ServiceResponseError,
  serviceErrorResponse,
  simulateServiceCall,
} from "@/shared/utils/service-latency";
import { getApiSimulationRoute } from "@/shared/utils/service-simulation-routes";
import { APP_NAME } from "@/shared/utils/page-meta";

const appRequestMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    let result;

    try {
      result = await next();
    } catch (error) {
      if (error instanceof ServiceResponseError) {
        const response = serviceErrorResponse(error);
        response.headers.set("x-app-name", APP_NAME);
        return response;
      }

      throw error;
    }

    if (result instanceof Response) {
      result.headers.set("x-app-name", APP_NAME);
      return result;
    }

    const response = addAppNameHeader(result.response);

    return {
      ...result,
      response,
    };
  },
);

const apiSimulationMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next, pathname }) => {
    const simulationConfig = getApiSimulationRoute(pathname);
    if (!simulationConfig) return next();

    try {
      await simulateServiceCall(simulationConfig);
    } catch (error) {
      if (error instanceof ServiceResponseError) {
        return addAppNameHeader(serviceErrorResponse(error));
      }

      throw error;
    }

    return next();
  },
);

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [
    csrfMiddleware,
    appRequestMiddleware,
    apiSimulationMiddleware,
  ],
}));

function addAppNameHeader(source: Response) {
  const response = new Response(source.body, {
    status: source.status,
    statusText: source.statusText,
    headers: source.headers,
  });

  response.headers.set("x-app-name", APP_NAME);

  return response;
}
