import { filterOutQuery } from "./filters.ts";
import { NetworkError } from "./networkError.ts";
import { shouldStartWithSlash } from "./shouldStartWithSlash.ts";
import { serve } from "./serve.ts";
import { Handler, Response, Request, Methods } from "./types.ts";
import { createHandler } from "./createHandler.ts";

function assignUrl(x: Request, y: string) {
  x.url = y;
  return x;
}

export class Router {
  private _stack: [[string] | [string, Methods], Handler][];
  constructor() {
    this._stack = [];
  }

  use(middleware: Handler): void;
  use(path: string, middleware: Handler): void;
  use(pathOrMiddleware: string | Handler, middleware?: Handler): void {
    if (typeof pathOrMiddleware !== "string") {
      this._stack.push([[""], pathOrMiddleware]);
    } else if (typeof pathOrMiddleware === "string" && !!middleware) {
      this._stack.push([[pathOrMiddleware], middleware]);
    } else {
      throw new NetworkError();
    }
  }

  add(method: Methods, path: string, handler: Handler): void {
    this._stack.push([[path, method], handler]);
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const reqUrl = shouldStartWithSlash(req.url);
    const l = this._stack.length;
    let idx = 0;

    const next = async (req: Request, res: Response): Promise<Response> => {
      if (idx >= l) return res;

      const [[originalPath, method], layer] = this._stack[idx++];
      const path = shouldStartWithSlash(originalPath);
      req.url = reqUrl;

      if (
        !method || method === req.method.toLowerCase()
      ) {
        if (filterOutQuery(reqUrl) === "/" && originalPath === "/") {
          return next(req, await layer(req, res));
        } else if (reqUrl.startsWith(path)) {
          const strippedReq = assignUrl(
            req,
            shouldStartWithSlash(reqUrl.substring(path.length)),
          );
          return next(req, await layer(strippedReq, res));
        } else {
          return next(req, res);
        }
      } else return next(req, res);
    };

    return next(req, res);
  }

  listen = async (port: number): Promise<void> => {
    await serve(port, createHandler((req, res) => this.handle(req, res)));
  };
}
