import {
  appendCwd,
  fileExists,
  RegistryJSON,
  RegistryJSONInternal,
  RegistryKV,
} from "../deps.ts";

const REGISTRY_PORTS_PATH = appendCwd("registry/ports.json");

export const getPortsRegistry = (): RegistryKV =>
  !fileExists(REGISTRY_PORTS_PATH) ? setPortsRegistry({}) : JSON.parse(
    Deno.readTextFileSync(REGISTRY_PORTS_PATH),
  );

export const setPortsRegistry = (r: RegistryKV) => {
  Deno.writeTextFileSync(REGISTRY_PORTS_PATH, JSON.stringify(r));
  return r;
};

export const getScriptRegistryInternal = (
  scriptName: string,
): RegistryJSONInternal => {
  const scriptDir = appendCwd(`/registry/${scriptName}.json`);
  if (!fileExists(scriptDir)) {
    throw new Error(`${scriptName} registry does not exist!`);
  }
  return JSON.parse(Deno.readTextFileSync(scriptDir));
};

export const getScriptRegistry = (scriptName: string): RegistryJSON => {
  const scriptDir = appendCwd(`/registry_in/${scriptName}/registry.json`);
  if (!fileExists(scriptDir)) {
    throw new Error(`${scriptName} registry does not exist!`);
  }
  return JSON.parse(Deno.readTextFileSync(scriptDir));
};

export const setScriptRegistry = (
  scriptName: string,
  port: number,
  rj: RegistryJSON,
): RegistryJSONInternal => {
  const internalRegistry: RegistryJSONInternal = {
    ...rj,
    name: scriptName,
    port,
  };

  Deno.writeTextFileSync(
    appendCwd(`/registry/${scriptName}.json`),
    JSON.stringify(internalRegistry),
  );

  return internalRegistry;
};
