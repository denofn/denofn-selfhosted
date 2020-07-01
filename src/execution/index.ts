import { opine } from "../../deps.ts";
import * as c from "./constants.ts";
import { fetchRegistry } from "./fetchRegistry.ts";
import { registerScriptHandler } from "./registerScriptHandler.ts";

const app = opine();
const scriptHandler = registerScriptHandler(app);

let registeredApps = {};
const setRegisteredApps = () => {
  console.log(`checking registered apps`);
  const oldRegisteredApps = Object.keys(registeredApps);
  const newRegisteredApps = fetchRegistry();

  Object.entries(newRegisteredApps).forEach(([scriptName, proxyUrl]) => {
    if (!oldRegisteredApps.includes(scriptName)) {
      scriptHandler(scriptName, proxyUrl);
      console.log(`Registered ${scriptName}`);
    }
  });

  registeredApps = newRegisteredApps;
};

setRegisteredApps();
setInterval(setRegisteredApps, c.REGISTRY_CHECK_INTERVAL);

console.log(`Serving on port ${8000}`);
app.listen(8000);

// TODO: warmup on boot (with flag in registry.json!)
// TODO: clearer logging with logger.ts
