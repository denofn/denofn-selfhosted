import { getPortsRegistry } from "../registry/registry.ts";

export const fetchRegistry = () => {
  const r: Record<string, string> = {};
  Object.entries(getPortsRegistry()).map((
    [script, port],
  ) => r[script] = `http://localhost:${port}`);
  return r;
};
