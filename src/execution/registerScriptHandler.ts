import { opine, proxy, UUID } from "../../deps.ts";
import * as c from "./constants.ts";
import * as db from "./db.ts";
import { killProcess } from "./killProcess.ts";
import { spawn } from "./spawn.ts";
import {
  warmup as warmupFunction,
  waitAndCheckHasBeenWarmedUp,
} from "./warmup.ts";

export const registerScriptHandler = (app: ReturnType<typeof opine>) =>
  (scriptName: string, proxyUrl: string) => {
    const endpoint = `/${scriptName}`;
    app.use(endpoint, async (req, res, next) => {
      // TODO: move to data structure of intervals that regularly check whether or not it needs to be cleaned up
      if (db.hasStarted(scriptName)) killProcess(scriptName);
      const lock = UUID.generate();

      if (
        !db.has(scriptName) ||
        (db.has(scriptName) && !db.get(scriptName)?.process)
      ) {
        // Scenario 1
        db.createLock(scriptName, lock); // Also creates entry if non-existent

        console.log(`Spawning new ${scriptName} instance`);
        const { pid: process } = await spawn(scriptName);
        const [warmup, started] = await warmupFunction(scriptName, proxyUrl);

        db.set(
          scriptName,
          { process, started, warmup, warmedUp: true },
        );
      } else if (
        db.has(scriptName) && !db.get(scriptName)?.process &&
        db.isLocked(scriptName)
      ) {
        // Scenario 2
        const waitCheck = waitAndCheckHasBeenWarmedUp(
          c.TIMEOUT_INCREMENT,
          scriptName,
        );

        let a = await waitCheck();
        while (!a) {
          a = await waitCheck();
        }

        db.createLock(scriptName, lock);
      } else {
        db.createLock(scriptName, lock);
      }

      proxy(
        proxyUrl,
        {
          srcResDecorator: (_, res, proxyResponse, proxyResData) => {
            console.log(`Serving request to ${endpoint}`);
            res.set({
              "Content-Type": "text/plain; charset=utf-8",
            });
            res.setStatus(proxyResponse.status).end(proxyResData);
            db.freeLock(scriptName, lock);
          },
        },
      )(req, res, next);
    });
  };

/**
 * Lambda starts - 2 scenarios:
 * 1) no db entry/no active process: lock FIRST -> spawn -> warm up -> do stuff -> free lock
 * 2) no active process but is locked already (this is why we lock FIRST in 1!): wait till warmed up -> then lock -> do stuff -> free lock
 */
