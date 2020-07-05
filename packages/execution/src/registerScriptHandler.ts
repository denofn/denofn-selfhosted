import {
  logger,
  opine,
  RegistryJSONInternal,
  UUID,
} from "../deps.ts";
import * as c from "./constants.ts";
import * as db from "./db.ts";
import { handleProxy } from "./handleProxy.ts";
import { spawn } from "./spawn.ts";
import { waitAndCheckHasBeenWarmedUp } from "./warmup.ts";

export const registerScriptHandler = (app: ReturnType<typeof opine>) =>
  (registry: RegistryJSONInternal) => {
    const { name: scriptName, port } = registry;
    app.use(`/${scriptName}`, async (req, res, next) => {
      let lockStart;
      const lock = UUID.generate();
      const has = db.has(scriptName);

      if (!has || (has && !db.get(scriptName)?.process)) {
        lockStart = await scenario1(registry, lock);
      } else if (
        has && !db.get(scriptName)?.process && db.isLocked(scriptName)
      ) {
        await scenario2(scriptName);
      }

      handleProxy(scriptName, port, lock, lockStart)(req, res, next);
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
  const lockStart = Date.now();

  const { name: scriptName } = registry;
  logger.system("Execution", `Spawning new ${scriptName} instance`);

  const { pid: process } = await spawn(registry);

  db.set(
    scriptName,
    { process, started: Date.now(), warmedUp: true },
  );

  return lockStart;
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
