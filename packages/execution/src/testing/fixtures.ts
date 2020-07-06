import { appendCwd } from "../../deps.ts";

export const writeScript = (scriptName: string, data: string) =>
  Deno.writeTextFileSync(appendCwd(`/registry/${scriptName}.js`), data);
export const removeScript = (scriptName: string) =>
  Deno.removeSync(appendCwd(`/registry/${scriptName}.js`));
