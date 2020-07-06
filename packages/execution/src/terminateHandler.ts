import { logger } from "../deps.ts";
import * as db from "./db.ts";
import { killProcess } from "./killProcess.ts";

export const terminateHandlerStorage = new Set<ReturnType<typeof setTimeout>>();

// ONLY EXPORTED FOR TESTING!
export const terminateHandler = (
  scriptName: string,
  configuredDelta: number,
) => {
  logger.script(scriptName, "Determining idle state", "verbose");
  const dbEntry = db.get(scriptName);
  if (
    typeof dbEntry?.process === "undefined" && !db.isLocked(scriptName)
  ) {
    logger.fail(scriptName, `Script is cold, skipping`, "info");
  } else if (
    (Date.now() - (db.get(scriptName)?.started as number)) > configuredDelta
  ) {
    killProcess(scriptName);
    logger.success(scriptName, `Terminated due to idle`, "file");
  } else logger.fail(scriptName, `Script is not idle, skipping`, "info");
};

export const createTerminateHandler = (
  configuredDelay: number,
  scriptName: string,
  configuredDelta: number,
) =>
  setInterval(
    () => terminateHandler(scriptName, configuredDelta),
    configuredDelay,
  );
