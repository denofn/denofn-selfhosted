import { appendCwd, dirExists, logger } from "../deps.ts";

const toReplaceId = `%SCRIPT_NAME%`;
const toReplacePortId = `%PORT%`;

export const bundle = async (scriptName: string, port: number) => {
  const toBundlePath = appendCwd(`/toBundle.ts`);

  if (!dirExists(appendCwd(`/registry_in/${scriptName}`))) {
    throw new Error(`Function ${scriptName} does not exist.`);
  }

  const bundlerFile = Deno.readTextFileSync(
    appendCwd(`/packages/templates/bundle.ts`),
  ).replaceAll(toReplaceId, scriptName).replaceAll(
    toReplacePortId,
    `${port}`,
  );

  Deno.writeTextFileSync(toBundlePath, bundlerFile);

  try {
    const p = runBundle(toBundlePath, appendCwd(`/registry/${scriptName}.js`));
    await p.status();
    p.close();

    logger.system("Registry", `Successfully registered ${scriptName}`, "file");
  } finally {
    // Clean up
    Deno.removeSync(toBundlePath);
  }
};

const runBundle = (toBundlePath: string, scriptPath: string) =>
  Deno.run({
    cmd: [
      "time",
      "deno",
      "bundle",
      toBundlePath,
      scriptPath,
    ],
  });
