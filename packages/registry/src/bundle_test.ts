import { appendCwd, fileExists } from "../deps.ts";
import { bundle } from "./bundle.ts";
import { assertThrowsAsync, assert } from "./testing/deps.ts";
import {
  writeRegistryScriptFolder,
  writeScript,
  removeRegistryScriptFolder,
  removeBundle,
  testScript,
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
    testScript,
  );

  await bundle("test", 4000);
  assert(fileExists(appendCwd(`/registry/test.js`)));

  removeRegistryScriptFolder("test");
  removeBundle("test");
});
