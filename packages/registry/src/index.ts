import { appendCwd, dirExists, logger } from "../deps.ts";
import { assignPortInRegistry } from "./assignPort.ts";
import { bundle } from "./bundle.ts";
import { getPortsRegistry } from "./registry.ts";

const registryIntake = appendCwd(`/registry_in`);

if (!dirExists(registryIntake)) {
  throw new Error(`Registry intake is not mounted`);
}

const args = Deno.args;
const isSilent = args.includes("silent");

async function checkRegistry(silent?: boolean) {
  const portsRegistry = getPortsRegistry();
  const scripts = Object.keys(portsRegistry);
  const scriptsInRegistryIntake = [];

  for (const e of Deno.readDirSync(registryIntake)) {
    if (e.isDirectory && !scripts.includes(e.name)) {
      scriptsInRegistryIntake.push(e.name);
    } else {
      !silent &&
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
}

// Always verbose on first run
await checkRegistry();
setInterval(() => checkRegistry(isSilent), 30_000);
