import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
import {
  ServiceResponseError,
  serviceErrorResponse,
} from "@/features/shared/service-latency";
import { APP_NAME } from "@/src/lib/page-meta";

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

    const response = new Response(result.response.body, {
      status: result.response.status,
      statusText: result.response.statusText,
      headers: result.response.headers,
    });

    response.headers.set("x-app-name", APP_NAME);

    return {
      ...result,
      response,
    };
  },
);

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, appRequestMiddleware],
}));
