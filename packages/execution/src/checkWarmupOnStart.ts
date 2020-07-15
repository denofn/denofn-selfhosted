import { appendCwd, fileExists, logger, RegistryJSONInternal, UUID, wait } from "../deps.ts";
import * as c from "./constants.ts";
import * as db from "./db.ts";
import { scenario1 } from "./registerScriptHandler.ts";

export const checkWarmupOnStart = async (registry: RegistryJSONInternal) => {
  const { name: scriptName, warmupOnStart } = registry;

  if (!warmupOnStart) {
    logger.system("Execution", `${scriptName} does not need warmup on start, skipping`, "verbose");
    return; // bail early
  }

  while (!fileExists(appendCwd(`/registry/${scriptName}.js`))) {
    await wait(c.TIMEOUT_INCREMENT);
  }

  logger.system("Execution", `Warming up ${scriptName}`, "info");
  const lock = UUID.generate();
  const lockStart = await scenario1(registry, lock);
  db.freeLock(scriptName, lock, lockStart);
};
