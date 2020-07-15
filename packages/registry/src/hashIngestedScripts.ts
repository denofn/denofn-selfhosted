import { logger, ScriptRegistryIntake, reservedNames } from "../deps.ts";
import { getPortsRegistry, getScriptRegistryInternal } from "./registry.ts";
import { getHashesFromDir } from "./getHashesFromDir.ts";

export const hashIngestedScripts = (registryIntake: string): ScriptRegistryIntake => {
  const portsRegistry = getPortsRegistry();
  const scripts = Object.keys(portsRegistry);
  const scriptsInRegistryIntake: ScriptRegistryIntake = [];

  for (const e of Deno.readDirSync(registryIntake)) {
    if (checkName(registryIntake, e)) {
      const hashes = scripts.includes(e.name) ? getScriptRegistryInternal(e.name).hashes : [];
      const newHashes = getHashesFromDir(e.name).sort();

      if (newHashes.length > 0) {
        JSON.stringify(hashes) !== JSON.stringify(newHashes)
          ? scriptsInRegistryIntake.push([e.name, newHashes])
          : logger.system("Registry", `No changes in ${e.name}, skipping`, "verbose");
      } else {
        logger.system("Registry", `No files in ${e.name}, skipping`, "info");
      }
    }
  }

  return scriptsInRegistryIntake;
};

function checkName(registryIntake: string, e: Deno.DirEntry) {
  if (!e.isDirectory) {
    e.name !== ".gitkeep" && Deno.removeSync(`${registryIntake}/${e.name}`);
    return false;
  } else if (e.isDirectory && reservedNames.includes(e.name)) {
    Deno.removeSync(`${registryIntake}/${e.name}`, { recursive: true });
    return false;
  }

  return true;
}
