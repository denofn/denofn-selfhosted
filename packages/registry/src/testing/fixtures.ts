import { REGISTRY_PORTS_PATH } from "./../registry.ts";
import { appendCwd } from "../../deps.ts";

export const removePortsRegistry = () => Deno.removeSync(REGISTRY_PORTS_PATH);

export const addPortsRegistry = (data: string) =>
  Deno.writeTextFileSync(REGISTRY_PORTS_PATH, data);

export const writeInternalRegistryJson = (scriptName: string, data: string) =>
  Deno.writeTextFileSync(appendCwd(`/registry/${scriptName}.json`), data);

export const removeInternalRegistryJson = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry/${scriptName}.json`));

export const writeRegistryScriptFolder = (scriptName: string) =>
  Deno.mkdirSync(appendCwd(`/registry_in/${scriptName}`));

export const removeRegistryScriptFolder = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry_in/${scriptName}`));

export const writeRegistryJson = (scriptName: string, data: string) =>
  Deno.writeTextFileSync(
    appendCwd(`/registry_in/${scriptName}/registry.json`),
    data,
  );

export const removeRegistryJson = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry_in/${scriptName}/registry.json`));

export const removeAllScriptRelatedFiles = (scriptName: string) => {
  removeRegistryJson(scriptName);
  removeRegistryScriptFolder(scriptName);
  removeInternalRegistryJson(scriptName);
  removePortsRegistry();
};

export const writeScript = (scriptName: string, data: string) =>
  Deno.writeTextFileSync(
    appendCwd(`/registry_in/${scriptName}/index.ts`),
    data,
  );

export const removeScript = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry_in/${scriptName}/index.ts`));
