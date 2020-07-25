import { createHandler } from "./createHandler.ts";
import { createResponseFromError } from "./createResponseFromError.ts";
import { filterOutQuery } from "./filters.ts";
import { NetworkError } from "./networkError.ts";
import { serve } from "./serve.ts";
import { shouldStartWithSlash } from "./shouldStartWithSlash.ts";
import * as T from "./types.ts";

function assignUrl(x: T.Request, y: string) {
  x.url = y;
  return x;
}

export class Router {
  private _stack: [[string] | [string, T.Methods], T.Handler][];
  constructor() {
    this._stack = [];
    this.use(async (req) =>
      createResponseFromError(new NetworkError(404, `Cannot find ${req.url}`))
    );
  }

  use(middleware: T.Handler): void;
  use(path: string, middleware: T.Handler): void;
  use(pathOrMiddleware: string | T.Handler, middleware?: T.Handler): void {
    if (typeof pathOrMiddleware !== "string") {
      this._stack.push([[""], pathOrMiddleware]);
    } else if (typeof pathOrMiddleware === "string" && !!middleware) {
      this._stack.push([[shouldStartWithSlash(pathOrMiddleware)], middleware]);
    } else {
      throw new NetworkError();
    }
  }

  add(method: T.Methods, path: string, handler: T.Handler): void {
    this._stack.push([[path, method], handler]);
  }

  async handle(req: T.Request, res: T.Response): Promise<T.Response> {
    const reqUrl = shouldStartWithSlash(req.url);
    const l = this._stack.length;
    let idx = 0;

    const next = async (req: T.Request, res: T.Response): Promise<T.Response> => {
      if (idx >= l) return res;

      const [[originalPath, method], layer] = this._stack[idx++];
      const path = shouldStartWithSlash(originalPath);
      req.url = reqUrl;

      if (!method || method === req.method.toLowerCase()) {
        if (originalPath === "") {
          return next(req, await layer(req, res));
        } else if (filterOutQuery(reqUrl) === "/" && originalPath === "/") {
          return next(req, await layer(req, res));
        } else if (filterOutQuery(reqUrl).split("/")[1] === path.split("/")[1]) {
          const strippedReq = assignUrl(req, shouldStartWithSlash(reqUrl.substring(path.length)));
          return next(req, await layer(strippedReq, res));
        } else {
          return next(req, res);
        }
      } else return next(req, res);
    };

    return next(req, res);
  }

  listen = async (port: number): Promise<void> => {
    await serve(
      port,
      createHandler((req, res) => this.handle(req, res))
    );
  };
}
