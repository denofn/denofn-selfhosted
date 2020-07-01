import { appendCwd } from "../shared/path.ts";

export async function spawn(scriptName: string) {
  return Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-net",
      appendCwd(`/registry/${scriptName}.js`),
    ],
  });
}
