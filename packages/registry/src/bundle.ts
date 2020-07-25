import { appendCwd, dirExists, logger } from "../deps.ts";

const toReplaceId = `%SCRIPT_NAME%`;
const toReplacePortId = `%PORT%`;

export const bundle = async (scriptName: string, port: number) => {
  const toBundlePath = appendCwd(`/toBundle-${scriptName}.ts`);

  if (!dirExists(appendCwd(`/registry_in/${scriptName}`))) {
    throw new Error(`Function ${scriptName} does not exist.`);
  }

  const bundlerFile = Deno.readTextFileSync(appendCwd(`/packages/templates/bundle.ts`))
    .replaceAll(toReplaceId, scriptName)
    .replaceAll(toReplacePortId, `${port}`);

  Deno.writeTextFileSync(toBundlePath, bundlerFile);

  try {
    await runBundle(scriptName, toBundlePath);
  } finally {
    // Clean up
    Deno.removeSync(toBundlePath);
  }
};

async function runBundle(scriptName: string, toBundlePath: string) {
  const destination = appendCwd(`/registry/${scriptName}.js`);
  const [diagnostics, emit] = await Deno.bundle(toBundlePath);

  if (!diagnostics) {
    Deno.writeTextFileSync(destination, emit);
    logger.system("Registry", `Successfully registered ${scriptName}`, "file");
  }
}
