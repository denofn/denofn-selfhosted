import {
  getPortsRegistry,
  setPortsRegistry,
  setScriptRegistry,
  getScriptRegistry,
} from "./registry.ts";

const basePort = 4000;
const maxPort = 4999;

export const assignPortInRegistry = (scriptName: string) => {
  const portsRegistry = getPortsRegistry();
  const highestPortInRegistry = Object.values(portsRegistry).sort((a, b) =>
    a - b
  )
    .pop();
  const nextPort = highestPortInRegistry ? highestPortInRegistry + 1 : basePort;

  if (nextPort > maxPort) {
    throw new Error(
      `Highest amount of available functions achieved. Please remove some applications to create new ones`,
    );
  }

  const scripts = Object.keys(portsRegistry);

  if (!scripts.includes(scriptName)) {
    const packageRegistry = setScriptRegistry(
      scriptName,
      nextPort,
      getScriptRegistry(scriptName),
    );

    setPortsRegistry(
      { ...portsRegistry, ...{ [scriptName]: nextPort } },
    );

    return packageRegistry;
  }
};
