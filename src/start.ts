import { createMiddleware, createStart } from "@tanstack/react-start";
import { APP_NAME } from "@/src/lib/page-meta";

const appRequestMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const result = await next();
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

export const startInstance = createStart(() => ({
  requestMiddleware: [appRequestMiddleware],
}));
