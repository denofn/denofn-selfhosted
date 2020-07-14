import { NetworkError } from "./networkError.ts";
import { shouldStartWithSlash } from "./shouldStartWithSlash.ts";
import { Handler, Response, Request, Methods } from "./types.ts";

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
    const l = this._stack.length;
    let idx = 0;

    const next = async (req: Request, res: Response): Promise<Response> => {
      if (idx >= l) return res;

      const [[originalPath, method], layer] = this._stack[idx++];
      const path = shouldStartWithSlash(originalPath);
      const rUrl = shouldStartWithSlash(req.url);

      if (
        !method || method === req.method.toLowerCase()
      ) {
        if (rUrl === "/" && originalPath === "/") {
          return next(req, await layer(req, res));
        } else if (rUrl.startsWith(path)) {
          return next(req, await layer(req, res));
        } else {
          return next(req, res);
        }
      } else return next(req, res);
    };

    return next(req, res);
  }
}
