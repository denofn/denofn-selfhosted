import { getScriptRegistryInternal, logger, opine } from "../deps.ts";
import { checkWarmupOnStart } from "./checkWarmupOnStart.ts";
import * as c from "./constants.ts";
import { fetchRegistry } from "./fetchRegistry.ts";
import { registerScriptHandler } from "./registerScriptHandler.ts";
import {
  createTerminateHandler,
  terminateHandlerStorage,
} from "./terminateHandler.ts";

const app = opine();
const scriptHandler = registerScriptHandler(app);

let registeredApps = {};

const attachHandlers = (scriptName: string, port: number) => {
  const oldRegisteredApps = Object.keys(registeredApps);

  if (!oldRegisteredApps.includes(scriptName)) {
    const internalRegistry = getScriptRegistryInternal(scriptName);

    scriptHandler(internalRegistry);
    terminateHandlerStorage.add(
      createTerminateHandler(c.MINUTE_IN_MS, scriptName, c.MAX_DELTA_LEN_MS),
    );

    logger.script(scriptName, `Has been registered`);
    checkWarmupOnStart(internalRegistry);
  }
};

const setRegisteredApps = () => {
  logger.system("Execution", "Checking registered scripts");
  const newRegisteredApps = fetchRegistry();

  for (const [scriptName, port] of Object.entries(newRegisteredApps)) {
    attachHandlers(scriptName, port);
  }

  registeredApps = newRegisteredApps;
};

setRegisteredApps();
setInterval(setRegisteredApps, c.REGISTRY_CHECK_INTERVAL);

logger.system("Execution", `Serving on port ${8000}`);
app.listen(8000);
