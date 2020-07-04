import { server } from "./deps.ts";

type LibHandler = (req: server.ServerRequest) => Promise<void>;
export type Handler = (req: Request) => Promise<Response | string>;
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

const createResponse = (r: Response | string): Response => {
  if (typeof r === "string") {
    return {
      body: r,
      status: 200,
      headers: new Headers({ "Content-Type": "text/plain; charset=utf-8" }),
    };
  }

  const headers = r.headers ??
    new Headers({ "Content-Type": "text/plain; charset=utf-8" });
  const status = r.status ?? 200;
  const body = r.body ? r.body : status === 200 ? "OK" : "";
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

export class NetworkError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createHandler = (h: Handler): LibHandler =>
  async (req: server.ServerRequest) => {
    const request: Request = createRequest(req);
    try {
      const response = createResponse(await h(request));
      req.respond(response);
    } catch (e) {
      const E: NetworkError = e;
      req.respond(createResponse({
        status: E.statusCode ?? 500,
        body: E.message ?? `Internal Server Error`,
      }));
    }
  };

export async function serve(handler: LibHandler, port: number) {
  for await (const req of server.serve({ port })) {
    await handler(req);
  }
}
