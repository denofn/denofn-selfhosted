import {
  logger,
  opine,
  proxyUrl,
  RegistryJSONInternal,
  UUID,
} from "../deps.ts";
import * as c from "./constants.ts";
import * as db from "./db.ts";
import { handleProxy } from "./handleProxy.ts";
import { spawn } from "./spawn.ts";
import {
  waitAndCheckHasBeenWarmedUp,
  warmup as warmupFunction,
} from "./warmup.ts";

export const registerScriptHandler = (app: ReturnType<typeof opine>) =>
  (registry: RegistryJSONInternal) => {
    const { name: scriptName, port } = registry;
    app.use(`/${scriptName}`, async (req, res, next) => {
      let lockStarted;
      const lock = UUID.generate();
      const has = db.has(scriptName);

      if (!has || (has && !db.get(scriptName)?.process)) {
        lockStarted = await scenario1(registry, lock);
      } else if (
        has && !db.get(scriptName)?.process && db.isLocked(scriptName)
      ) {
        await scenario2(scriptName);
      }

      handleProxy(scriptName, port, lock, lockStarted)(req, res, next);
    });
  };

/**
 * Lambda starts - 2 scenarios:
 * 1) no db entry/no active process: lock FIRST -> spawn -> warm up -> do stuff -> free lock
 * 2) no active process but is locked already (this is why we lock FIRST in 1!): wait till warmed up -> then lock -> do stuff -> free lock
 */

export async function scenario1(
  registry: RegistryJSONInternal,
  lock: string,
) {
  db.createLock(registry.name, lock); // Also creates entry if non-existent
  const now = Date.now();

  const { name: scriptName, port } = registry;
  logger.system("Execution", `Spawning new ${scriptName} instance`);

  const { pid: process } = await spawn(registry);
  const [warmup, started] = await warmupFunction(scriptName, proxyUrl(port));

  db.set(
    scriptName,
    { process, started, warmup, warmedUp: true },
  );

  return now;
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
