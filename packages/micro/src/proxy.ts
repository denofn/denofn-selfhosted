import { appendHeaders } from "./appendHeaders.ts";
import { createResponse } from "./createResponse.ts";
import { createResponseFromError } from "./createResponseFromError.ts";
import { raceProxyAgainstTimeout } from "./raceProxyAgainstTimeout.ts";
import { readResponseBody } from "./readBody.ts";
import { buildRequest } from "./buildRequest.ts";
import { Request, Response } from "./types.ts";

export const proxy = (url: string, timeout?: number) =>
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await raceProxyAgainstTimeout(
        fetch(...await buildRequest(url, req)),
        timeout,
      ) as globalThis.Response;

      return createResponse({
        headers: appendHeaders(res.headers, result.headers),
        status: result.status,
        body: await readResponseBody(result),
      });
    } catch (e) {
      return createResponseFromError(e);
    }
  };
