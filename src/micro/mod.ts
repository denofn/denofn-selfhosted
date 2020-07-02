import { server } from "./deps.ts";

export type Response = server.Response;
export type Request = {
  body: () => Deno.Reader;
  contentLength: () => number | null;
  headers: Headers;
  url: string;
  method: string;
  proto: string;
  protoMajor: number;
  protoMinor: number;
};

export type Handler = (req: Request) => Response | string;

type LibHandler = (req: server.ServerRequest) => void;

const createResponse = (r: Response | string): Response => {
  if (typeof r === "string") {
    return {
      body: r,
      status: 200,
      headers: new Headers({ "Content-Type": "text/plain; charset=utf-8" }),
    };
  }

  const headers = r.headers ||
    new Headers({ "Content-Type": "text/plain; charset=utf-8" });
  const status = r.status || 200;
  const body = r.body || status === 200 ? "OK" : undefined;
  return {
    headers,
    status,
    body,
  };
};

const createRequest = (req: server.ServerRequest): Request => ({
  body: () => req.body,
  contentLength: () => req.contentLength,
  headers: req.headers,
  url: req.url,
  method: req.method,
  proto: req.proto,
  protoMajor: req.protoMajor,
  protoMinor: req.protoMinor,
});

export async function serve(handler: LibHandler, port: number) {
  const s = server.serve({ port });

  for await (const req of s) {
    handler(req);
  }
}

export const createHandler = (h: Handler): LibHandler =>
  (req: server.ServerRequest) => {
    const request: Request = createRequest(req);
    const response = createResponse(h(request));
    req.respond(response);
  };
