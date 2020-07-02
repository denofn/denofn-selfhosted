import { proxy } from "../../deps.ts";
import * as db from "./db.ts";

export const handleProxy = (
  scriptName: string,
  proxyUrl: string,
  lock: string,
  lockStarted?: number,
) =>
  (req: any, res: any, next: any) => {
    if (!lockStarted) db.createLock(scriptName, lock);

    const newStarted = Date.now(); // instantiate where the actual request is started

    // TODO: properly handle in a routing library (shared between execution and scripts)
    proxy(
      proxyUrl,
      {
        srcResDecorator: (_, res, proxyResponse, proxyResData) => {
          // TODO: check if proxy reponse already gives proper headers when defined
          res.set({
            "Content-Type": "text/plain; charset=utf-8",
          });
          res.setStatus(proxyResponse.status).end(proxyResData);
          db.freeLock(scriptName, lock, newStarted, lockStarted);
        },
      },
    )(req, res, next);
  };
