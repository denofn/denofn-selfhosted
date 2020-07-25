import { server } from "../deps.ts";
import { createResponse } from "./createResponse.ts";
import { returnNetworkErrorOnCatch } from "./createResponseFromError.ts";
import * as T from "./types.ts";

export const createHandler = (h: T.Handler): T.LibHandler => async (req: server.ServerRequest) =>
  returnNetworkErrorOnCatch(async () => createResponse(await h(req, createResponse({}))));
