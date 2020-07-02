import { opine } from "../../deps.ts";
import * as logger from "../shared/logger.ts";
import * as c from "./constants.ts";
import { fetchRegistry } from "./fetchRegistry.ts";
import { registerScriptHandler } from "./registerScriptHandler.ts";
import {
  createTerminateHandler,
  terminateHandlerStorage,
} from "./terminateHandler.ts";

// TODO: execution dockerfile

const app = opine();
const scriptHandler = registerScriptHandler(app);

let registeredApps = {};

const attachHandlers = (scriptName: string, proxyUrl: string) => {
  const oldRegisteredApps = Object.keys(registeredApps);

  if (!oldRegisteredApps.includes(scriptName)) {
    scriptHandler(scriptName, proxyUrl);
    terminateHandlerStorage.add(
      createTerminateHandler(c.MINUTE_IN_MS, scriptName, c.MAX_DELTA_LEN_MS),
    );

    logger.script(scriptName, `Has been registered`);
  }
};

const setRegisteredApps = () => {
  logger.system("Execution", "Checking registered scripts");
  const newRegisteredApps = fetchRegistry();

  for (const [scriptName, proxyUrl] of Object.entries(newRegisteredApps)) {
    attachHandlers(scriptName, proxyUrl);
  }

  registeredApps = newRegisteredApps;
};

setRegisteredApps();
setInterval(setRegisteredApps, c.REGISTRY_CHECK_INTERVAL);

logger.system("Execution", `Serving on port ${8000}`);
app.listen(8000);

// TODO: warmup on boot (with flag in registry.json!)
