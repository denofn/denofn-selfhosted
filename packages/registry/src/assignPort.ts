import { RegistryJSONInternal, sortNumbers } from "../deps.ts";
import {
  getPortsRegistry,
  getScriptRegistry,
  setPortsRegistry,
  setScriptRegistry,
} from "./registry.ts";

const basePort = 4000;
const maxPort = 4999;

export const assignPortInRegistry = (scriptName: string) => {
  const portsRegistry = getPortsRegistry();
  const highestPortInRegistry = Object.values(portsRegistry).sort(sortNumbers)
    .pop();
  const nextPort = highestPortInRegistry ? highestPortInRegistry + 1 : basePort;

  if (nextPort > maxPort) {
    throw new Error(
      `Highest amount of available functions achieved. Please remove some applications to create new ones`,
    );
  }

  return persistToFile(scriptName, nextPort, portsRegistry);
};

function persistToFile(
  scriptName: string,
  nextPort: number,
  registry: Record<string, number>,
): RegistryJSONInternal {
  const scripts = Object.keys(registry);

  if (!scripts.includes(scriptName)) {
    const packageRegistry = setScriptRegistry(
      scriptName,
      nextPort,
      getScriptRegistry(scriptName),
    );

    setPortsRegistry(
      { ...registry, ...{ [scriptName]: nextPort } },
    );

    return packageRegistry;
  } else return {} as RegistryJSONInternal;
}
