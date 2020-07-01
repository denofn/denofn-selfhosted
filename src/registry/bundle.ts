import { dirExists } from "../shared/dirExists.ts";
import { appendCwd } from "../shared/path.ts";

const toReplaceId = `%SCRIPT_NAME%`;
const toReplacePortId = `%PORT%`;

export const bundle = async (scriptName: string, portName: number) => {
  const toBundlePath = appendCwd(`/toBundle.ts`);

  if (dirExists(appendCwd(`/registry_in/${scriptName}`))) {
    // Create toBundle.ts
    const bundlerFile = Deno.readTextFileSync(
      appendCwd(`/templates/bundle.ts`),
    ).replaceAll(toReplaceId, scriptName).replaceAll(
      toReplacePortId,
      `${portName}`,
    );

    Deno.writeTextFileSync(toBundlePath, bundlerFile);

    // Bundle
    const p = Deno.run({
      cmd: [
        "deno",
        "bundle",
        toBundlePath,
        appendCwd(`/registry/${scriptName}.js`),
      ],
    });

    // Clean up
    try {
      await p.status();
    } finally {
      Deno.removeSync(toBundlePath);
    }
  } else {
    throw new Error(`Function ${scriptName} does not exist.`);
  }
};
