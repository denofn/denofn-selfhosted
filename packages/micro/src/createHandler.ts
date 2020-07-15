import { server } from "../deps.ts";
import { createResponse } from "./createResponse.ts";
import { NetworkError } from "./networkError.ts";
import * as T from "./types.ts";

export const createHandler = (h: T.Handler): T.LibHandler =>
  async (req: server.ServerRequest) => {
    try {
      const response = createResponse(
        await h(req, createResponse({})),
      );
      return response;
    } catch (e) {
      const E: NetworkError = e;
      return createResponse({
        status: E.statusCode ?? 500,
        body: E.message ?? `Internal Server Error`,
      });
    }
  };
