import { ScriptRegistryIntake } from "../deps.ts";
import { assignPort } from "./assignPort.ts";
import { bundle } from "./bundle.ts";
import {
  getPortsRegistry,
  getScriptRegistry,
  setPortsRegistry,
  setScriptRegistry,
} from "./registry.ts";

export const persistRegistryInfo = async (scriptsInRegistryIntake: ScriptRegistryIntake) => {
  for (const [name, hashes] of scriptsInRegistryIntake) {
    const port = assignPort(name);

    setScriptRegistry({ name, port, hashes }, getScriptRegistry(name));
    setPortsRegistry({ ...getPortsRegistry(), [name]: port });
    await bundle(name, port);
  }
};
