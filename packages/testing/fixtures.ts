import { REGISTRY_PORTS_PATH } from "../registry/src/registry.ts";
import { appendCwd } from "../shared/src/path.ts";

export const removePortsRegistry = () => Deno.removeSync(REGISTRY_PORTS_PATH);

export const addPortsRegistry = (data: string) => Deno.writeTextFileSync(REGISTRY_PORTS_PATH, data);

export const writeInternalRegistryJson = (scriptName: string, data: string) =>
  Deno.writeTextFileSync(appendCwd(`/registry/${scriptName}.json`), data);

export const removeInternalRegistryJson = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry/${scriptName}.json`));

export const writeRegistryScriptFolder = (scriptName: string) =>
  Deno.mkdirSync(appendCwd(`/registry_in/${scriptName}`));

export const removeRegistryScriptFolder = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry_in/${scriptName}`), { recursive: true });

export const writeRegistryJson = (scriptName: string, data: string) =>
  Deno.writeTextFileSync(appendCwd(`/registry_in/${scriptName}/registry.json`), data);

export const removeRegistryJson = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry_in/${scriptName}/registry.json`));

export const removeAllScriptRelatedFiles = (scriptName: string) => {
  removeRegistryJson(scriptName);
  removeRegistryScriptFolder(scriptName);
  removeInternalRegistryJson(scriptName);
  removePortsRegistry();
};

export const writeScript = (scriptName: string, data: string) =>
  Deno.writeTextFileSync(appendCwd(`/registry_in/${scriptName}/index.ts`), data);

export const removeScript = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry_in/${scriptName}/index.ts`));

export const writeBundle = (scriptName: string, data: string) =>
  Deno.writeTextFileSync(appendCwd(`/registry/${scriptName}.js`), data);

export const removeBundle = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry/${scriptName}.js`));

export const writeSymlink = (oldpath: string, newpath: string) =>
  Deno.symlinkSync(appendCwd(`/registry_in/${oldpath}`), appendCwd(`/registry_in/${newpath}`));

export const removeSymlink = (path: string) => Deno.removeSync(appendCwd(`/registry_in/${path}`));

export const testScript = `import {
  createHandler,
  createResponseFromError,
  Handler,
  NetworkError,
} from "../../packages/micro/mod.ts";

const handler: Handler = async () => {
  try {
    const data = await fetch(\`https://swapi.dev/api/people/1\`);
    const result = await data.json();
    return {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(result),
      status: 200,
    };
  } catch {
    return createResponseFromError(new NetworkError());
  }
};

export default createHandler(handler);
`;
