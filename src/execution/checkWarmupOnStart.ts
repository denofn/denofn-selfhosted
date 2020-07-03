import { UUID } from "../../deps.ts";
import { getScriptRegistryInternal } from "../registry/registry.ts";
import * as logger from "../shared/logger.ts";
import { wait } from "../shared/wait.ts";
import * as db from "./db.ts";
import { scenario1 } from "./registerScriptHandler.ts";

export const checkWarmupOnStart = async (
  scriptName: string,
  port: number,
) => {
  // TODO: properly defer till exists with exponential backoff
  await wait(5_000);

  const { warmupOnStart } = getScriptRegistryInternal(scriptName);

  if (!warmupOnStart) {
    logger.system(
      "Execution",
      `${scriptName} does not need warmup on start, skipping`,
    );
    return;
  }

  logger.system("Execution", `Warming up ${scriptName}`);
  const lock = UUID.generate();
  const lockStarted = await scenario1(scriptName, port, lock);
  db.freeLock(scriptName, lock, lockStarted);
};
