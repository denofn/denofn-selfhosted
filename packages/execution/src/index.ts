import {
  getPortsRegistry,
  getScriptRegistryInternal,
  logger,
  LogLevel,
  opine,
} from "../deps.ts";
import { checkWarmupOnStart } from "./checkWarmupOnStart.ts";
import * as c from "./constants.ts";
import { registerScriptHandler } from "./registerScriptHandler.ts";
import {
  createTerminateHandler,
  terminateHandlerStorage,
} from "./terminateHandler.ts";

const args = Deno.args;
logger.setLogLevel(
  logger.levels.includes(args[0] as LogLevel) ? args[0] as LogLevel : "info",
);

const app = opine();
const scriptHandler = registerScriptHandler(app);

let registeredApps = {};

const attachHandlers = (scriptName: string) => {
  const oldRegisteredApps = Object.keys(registeredApps);

  if (!oldRegisteredApps.includes(scriptName)) {
    const internalRegistry = getScriptRegistryInternal(scriptName);

    scriptHandler(internalRegistry);
    terminateHandlerStorage.add(
      createTerminateHandler(c.MINUTE_IN_MS, scriptName, c.MAX_DELTA_LEN_MS),
    );

    logger.script(scriptName, `Has been registered`, "file");
    checkWarmupOnStart(internalRegistry);
  }
};

const setRegisteredApps = () => {
  logger.system("Execution", "Checking registered scripts", "verbose");
  const newRegisteredApps = getPortsRegistry();

  for (const [scriptName] of Object.entries(newRegisteredApps)) {
    attachHandlers(scriptName);
  }

  registeredApps = newRegisteredApps;
};

setRegisteredApps();
setInterval(setRegisteredApps, c.REGISTRY_CHECK_INTERVAL);

logger.system("Execution", `Serving on port ${8000}`, "info");
app.listen(8000);
