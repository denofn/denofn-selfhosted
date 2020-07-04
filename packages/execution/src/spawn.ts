import { appendCwd, RegistryJSONInternal } from "../deps.ts";

export const spawn = async (
  { name: scriptName, whitelist, port }: RegistryJSONInternal,
) =>
  Deno.run({
    cmd: [
      "deno",
      "run",
      `--allow-net=${[`0.0.0.0:${port}`, ...whitelist].join(",")}`,
      appendCwd(`/registry/${scriptName}.js`),
    ],
  });
