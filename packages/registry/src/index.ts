import { appendCwd, dirExists, logger, LogLevel } from "../deps.ts";
import { hashIngestedScripts } from "./hashIngestedScripts.ts";
import { persistRegistryInfo } from "./persistRegistryInfo.ts";

const registryIntake = appendCwd(`/registry_in`);

if (!dirExists(registryIntake)) {
  throw new Error(`Registry intake is not mounted`);
}

const args = Deno.args;
logger.setLogLevel(logger.levels.includes(args[0] as LogLevel) ? (args[0] as LogLevel) : "info");

const checkRegistry = async () => {
  const hashedScripts = hashIngestedScripts(registryIntake);
  await persistRegistryInfo(hashedScripts);
};

await checkRegistry();
setInterval(() => checkRegistry(), 30_000);
