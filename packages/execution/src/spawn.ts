import { appendCwd, RegistryJSONInternal } from "../deps.ts";

export const spawn = async ({
  name: scriptName,
  whitelist,
  port,
}: RegistryJSONInternal): Promise<Deno.Process> => {
  const d = new TextDecoder();
  const p = Deno.run({
    cmd: [
      "deno",
      "run",
      `--allow-net=${[`0.0.0.0:${port}`, ...whitelist].join(",")}`,
      appendCwd(`/registry/${scriptName}.js`),
    ],
    stdout: "piped",
  });

  for await (const b of Deno.iter(p.stdout)) {
    if (d.decode(b).startsWith(scriptName)) return p;
  }

  return p;
};
