import { dirExists } from "../shared/dirExists.ts";
import * as logger from "../shared/logger.ts";
import { appendCwd } from "../shared/path.ts";
import { assignPortInRegistry } from "./assignPort.ts";
import { bundle } from "./bundle.ts";
import { getPortsRegistry } from "./registry.ts";

const registryIntake = appendCwd(`/registry_in`);

if (!dirExists(registryIntake)) {
  throw new Error(`Registry intake is not mounted`);
}

const portsRegistry = getPortsRegistry();
const scripts = Object.keys(portsRegistry);
const scriptsInRegistryIntake = [];

for (const e of Deno.readDirSync(registryIntake)) {
  if (e.isDirectory && !scripts.includes(e.name)) {
    scriptsInRegistryIntake.push(e.name);
  } else {
    logger.system("Registry", `Skipping ${e.name}, already registered`);
  }
}

for (let i = 0; i < scriptsInRegistryIntake.length; i++) {
  const dirName = scriptsInRegistryIntake[i];
  const packageRegistry = assignPortInRegistry(dirName);

  if (packageRegistry?.name && packageRegistry?.port) {
    await bundle(packageRegistry.name, packageRegistry.port);
  }
}
