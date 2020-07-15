import { filterOutTrailingSlash } from "./filters.ts";
import { getContentLength } from "./getContentLength.ts";
import { readRequestBody } from "./readBody.ts";
import * as T from "./types.ts";

export async function buildRequest(
  proxyUrl: string,
  req: T.Request
): Promise<[string, RequestInit]> {
  const parsedProxyRequestUrl = `${filterOutTrailingSlash(proxyUrl)}${req.url}`;
  const body = await readRequestBody(req.body);
  const headers = req.headers;
  const mode = "cors";
  const method = req.method;

  headers.set("content-length", `${getContentLength(body)}`);
  headers.set("connection", "close");

  return [
    parsedProxyRequestUrl,
    {
      headers,
      mode,
      method,
      body,
    },
  ];
}
