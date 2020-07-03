import { getPortsRegistry } from "../registry/registry.ts";

export const fetchRegistry = () => {
  const r: Record<string, number> = {};
  Object.entries(getPortsRegistry()).map((
    [script, port],
  ) => r[script] = port);
  return r;
};
