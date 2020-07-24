import { dirExists, PartialInternalRegistry } from "../../shared/mod.ts";
import { appendCwd, fileExists, RegistryJSON, RegistryJSONInternal, RegistryKV } from "../deps.ts";

export const REGISTRY_PORTS_PATH = appendCwd("registry/ports.json");
export const USR_PATH = appendCwd("registry/usr");

export const getPortsRegistry = (): RegistryKV =>
  !fileExists(REGISTRY_PORTS_PATH)
    ? setPortsRegistry({})
    : JSON.parse(Deno.readTextFileSync(REGISTRY_PORTS_PATH));

export const setPortsRegistry = (r: RegistryKV) => {
  Deno.writeTextFileSync(REGISTRY_PORTS_PATH, JSON.stringify(r));
  return r;
};

export const isUsr = (u: string): boolean => {
  if (!fileExists(USR_PATH)) {
    setUsr(u);
    return true;
  }

  const usr = Deno.readTextFileSync(USR_PATH);
  return usr === u;
};

export const setUsr = (u: string) => {
  Deno.writeTextFileSync(USR_PATH, u);
};

export const getScriptRegistryInternal = (scriptName: string): RegistryJSONInternal => {
  const scriptDir = appendCwd(`/registry/${scriptName}.json`);
  if (!fileExists(scriptDir)) {
    throw new Error(`${scriptName} internal registry does not exist!`);
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

export const saveScriptRegistry = (
  scriptName: string,
  registry: RegistryJSON,
  checkExists?: boolean
): boolean => {
  const scriptDir = appendCwd(`/registry_in/${scriptName}/registry.json`);
  if ((checkExists ?? true) && !fileExists(scriptDir)) {
    return false;
  }

  Deno.writeTextFileSync(scriptDir, JSON.stringify(registry));

  return true;
};

export const getIndex = (scriptName: string): string => {
  const scriptDir = appendCwd(`/registry_in/${scriptName}/index.ts`);
  if (!fileExists(scriptDir)) {
    throw new Error(`${scriptName} index does not exist!`);
  }
  return Deno.readTextFileSync(scriptDir);
};

export const saveIndex = (scriptName: string, code: string, checkExists?: boolean): boolean => {
  const scriptDir = appendCwd(`/registry_in/${scriptName}/index.ts`);
  if ((checkExists ?? true) && !fileExists(scriptDir)) {
    return false;
  }

  Deno.writeTextFileSync(scriptDir, code);

  return true;
};

export const createScriptDir = (scriptName: string) => {
  const scriptDir = appendCwd(`/registry_in/${scriptName}`);
  if (dirExists(scriptDir)) {
    return false;
  }

  Deno.mkdirSync(scriptDir);

  return true;
};

export const setScriptRegistry = (
  rji: PartialInternalRegistry,
  rj: RegistryJSON
): RegistryJSONInternal => {
  const internalRegistry: RegistryJSONInternal = {
    ...rj,
    ...rji,
  };

  Deno.writeTextFileSync(appendCwd(`/registry/${rji.name}.json`), JSON.stringify(internalRegistry));

  return internalRegistry;
};
