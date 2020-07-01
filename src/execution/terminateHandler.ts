import * as logger from "../shared/logger.ts";
import * as db from "./db.ts";
import { killProcess } from "./killProcess.ts";

export const terminateHandlerStorage = new Set<ReturnType<typeof setTimeout>>();

const terminateHandler = (
  scriptName: string,
  configuredDelta: number,
) => {
  logger.script(scriptName, "Determining idle state");
  const dbEntry = db.get(scriptName);
  if (
    typeof dbEntry?.process === "undefined" && !db.isLocked(scriptName)
  ) {
    logger.noTermination(scriptName, `Script is cold, skipping`);
  } else if (
    (Date.now() - (db.get(scriptName)?.started as number)) > configuredDelta
  ) {
    killProcess(scriptName);
    logger.terminationSuccess(scriptName, `Terminated due to idle`);
  } else logger.noTermination(scriptName, `Script is not idle, skipping`);
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
