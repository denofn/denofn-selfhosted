import { buildRequest } from "./buildRequest.ts";
import { createResponse } from "./createResponse.ts";
import { createResponseFromError } from "./createResponseFromError.ts";
import { mergeHeaders } from "./mergeHeaders.ts";
import { raceProxyAgainstTimeout } from "./raceProxyAgainstTimeout.ts";
import { readResponseBody } from "./readBody.ts";
import * as T from "./types.ts";

export const proxy = (url: string, timeout?: number) => async (
  req: T.Request,
  res: T.Response
): Promise<T.Response> => {
  try {
    const result = (await raceProxyAgainstTimeout(
      fetch(...(await buildRequest(url, req))),
      timeout
    )) as globalThis.Response;

    return createResponse({
      headers: mergeHeaders(res.headers, result.headers),
      status: result.status,
      body: await readResponseBody(result),
    });
  } catch (e) {
    return createResponseFromError(e);
  }
};
