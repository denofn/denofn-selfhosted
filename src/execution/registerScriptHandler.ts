import { opine, UUID } from "../../deps.ts";
import * as logger from "../shared/logger.ts";
import * as c from "./constants.ts";
import * as db from "./db.ts";
import { handleProxy } from "./handleProxy.ts";
import { spawn } from "./spawn.ts";
import {
  waitAndCheckHasBeenWarmedUp,
  warmup as warmupFunction,
} from "./warmup.ts";

export const registerScriptHandler = (app: ReturnType<typeof opine>) =>
  (scriptName: string, proxyUrl: string) => {
    app.use(`/${scriptName}`, async (req, res, next) => {
      let shouldCreateLock = true;
      const lock = UUID.generate();
      const has = db.has(scriptName);

      if (!has || (has && !db.get(scriptName)?.process)) {
        await scenario1(scriptName, proxyUrl, lock);
        shouldCreateLock = false;
      } else if (
        has && !db.get(scriptName)?.process && db.isLocked(scriptName)
      ) {
        await scenario2(scriptName);
      }

      handleProxy(scriptName, proxyUrl, lock, shouldCreateLock)(req, res, next);
    });
  };

/**
 * Lambda starts - 2 scenarios:
 * 1) no db entry/no active process: lock FIRST -> spawn -> warm up -> do stuff -> free lock
 * 2) no active process but is locked already (this is why we lock FIRST in 1!): wait till warmed up -> then lock -> do stuff -> free lock
 */

async function scenario1(scriptName: string, proxyUrl: string, lock: string) {
  db.createLock(scriptName, lock); // Also creates entry if non-existent

  logger.system("Execution", `Spawning new ${scriptName} instance`);

  const { pid: process } = await spawn(scriptName);
  const [warmup, started] = await warmupFunction(scriptName, proxyUrl);

  db.set(
    scriptName,
    { process, started, warmup, warmedUp: true },
  );
}

async function scenario2(scriptName: string) {
  const waitCheck = waitAndCheckHasBeenWarmedUp(
    c.TIMEOUT_INCREMENT,
    scriptName,
  );

  let a = await waitCheck();
  while (!a) {
    a = await waitCheck();
  }
}
