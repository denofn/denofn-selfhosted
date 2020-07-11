import { sortNumbers } from "../deps.ts";
import { getPortsRegistry } from "./registry.ts";

export const basePort = 4000;
export const maxPort = 4999;

export const assignPort = (name: string) => {
  const portsRegistry = getPortsRegistry();
  const highestPortInRegistry = Object.values(portsRegistry).sort(sortNumbers)
    .pop();
  const nextPort = highestPortInRegistry ? highestPortInRegistry + 1 : basePort;
  const port = portsRegistry[name] ?? nextPort;

  if (port > maxPort) {
    throw new Error(
      `Highest amount of available functions achieved. Please remove some applications to create new ones`,
    );
  }

  return port;
};
