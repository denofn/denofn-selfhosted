import { logger, RegistryJSONInternal, UUID, wait } from "../deps.ts";
import * as db from "./db.ts";
import { scenario1 } from "./registerScriptHandler.ts";

export const checkWarmupOnStart = async (
  registry: RegistryJSONInternal,
) => {
  const { name: scriptName, warmupOnStart } = registry;

  // TODO: properly defer till exists with exponential backoff
  await wait(5_000);

  if (!warmupOnStart) {
    logger.system(
      "Execution",
      `${scriptName} does not need warmup on start, skipping`,
    );
    return;
  }

  logger.system("Execution", `Warming up ${scriptName}`);
  const lock = UUID.generate();
  const lockStarted = await scenario1(registry, lock);
  db.freeLock(scriptName, lock, lockStarted);
};
