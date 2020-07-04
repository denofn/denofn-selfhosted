import { proxy, proxyUrl } from "../deps.ts";
import * as db from "./db.ts";

export const handleProxy = (
  scriptName: string,
  port: number,
  lock: string,
  lockStarted?: number,
) =>
  (req: any, res: any, next: any) => {
    if (!lockStarted) db.createLock(scriptName, lock);

    const newStarted = Date.now(); // instantiate where the actual request is started

    // TODO: properly handle in a routing library (shared between execution and scripts)
    proxy(
      proxyUrl(port),
      {
        srcResDecorator: (_, res, proxyResponse, proxyResData) => {
          res.set(proxyResponse.headers).setStatus(proxyResponse.status).end(
            proxyResData,
          );
          db.freeLock(scriptName, lock, newStarted, lockStarted);
        },
      },
    )(req, res, next);
  };
