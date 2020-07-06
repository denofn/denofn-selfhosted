import { appendCwd, fileExists } from "../deps.ts";
import { bundle } from "./bundle.ts";
import { assertThrowsAsync, assert } from "./testing/deps.ts";
import {
  writeRegistryScriptFolder,
  writeScript,
  removeScript,
  removeRegistryScriptFolder,
} from "./testing/fixtures.ts";

Deno.test("should throw when no script directory present", async () => {
  assertThrowsAsync(async () => {
    await bundle("test", 4000);
  });
});

Deno.test("should bundle test script to js file in registry", async () => {
  writeRegistryScriptFolder("test");
  writeScript(
    "test",
    `import {
  createHandler,
  Handler,
} from "../../packages/micro/mod.ts";

const handler: Handler = async (_) => {
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
    return \`Something happened, don't know what.\`;
  }
};

export default createHandler(handler);
`,
  );

  await bundle("test", 4000);
  assert(fileExists(appendCwd(`/registry/test.js`)));

  removeScript("test");
  removeRegistryScriptFolder("test");
});
