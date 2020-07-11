import {
  appendCwd,
  dirExists,
  fileExists,
  logger,
  reservedNames,
} from "../deps.ts";
import { basePort } from "./assignPort.ts";
import { hashIngestedScripts } from "./hashIngestedScripts.ts";
import { assertEquals } from "./testing/deps.ts";
import {
  removeRegistryScriptFolder,
  writeRegistryScriptFolder,
  writeScript,
  writeInternalRegistryJson,
  removePortsRegistry,
  removeInternalRegistryJson,
} from "./testing/fixtures.ts";
import { setPortsRegistry } from "./registry.ts";

let a: string[] = [];
logger.setLogLevel("verbose");
logger.setLoggingFn((...args: any[]) => a = args);
const assertWithCleanup = (act: string) => {
  assertEquals(a[1].trim(), act);
  a = [];
};

const registryIntake = appendCwd("/registry_in");

Deno.test("should skip files on registry top level", () => {
  Deno.writeTextFileSync(appendCwd("/registry_in/test.txt"), ``);

  assertEquals(hashIngestedScripts(registryIntake).length, 0);
  assertEquals(fileExists(appendCwd("/registry_in/test.txt")), false);
});

Deno.test("should skip empty folders", () => {
  writeRegistryScriptFolder("test");

  assertEquals(hashIngestedScripts(registryIntake).length, 0);
  assertWithCleanup(`No files in test, skipping`);

  removeRegistryScriptFolder("test");
});

Deno.test("should remove folders named after reserved names", () => {
  reservedNames.forEach((n) => writeRegistryScriptFolder(n));

  assertEquals(hashIngestedScripts(registryIntake).length, 0);
  reservedNames.forEach((n) =>
    assertEquals(dirExists(appendCwd(`/registry_in/${n}`)), false)
  );
});

Deno.test("should hash files", () => {
  writeRegistryScriptFolder("test");
  writeScript("test", ``);

  const hashes = hashIngestedScripts(registryIntake);
  assertEquals(hashes.length, 1);
  assertEquals(hashes[0], ["test", ["d41d8cd98f00b204e9800998ecf8427e"]]);

  removeRegistryScriptFolder("test");
});

Deno.test("should log skip on unchanged folders", () => {
  writeRegistryScriptFolder("test");
  writeScript("test", ``);
  setPortsRegistry({ test: basePort });
  writeInternalRegistryJson(
    "test",
    `{"hashes":["d41d8cd98f00b204e9800998ecf8427e"]}`,
  );

  const hashes = hashIngestedScripts(registryIntake);
  assertEquals(hashes.length, 0);
  assertWithCleanup(`No changes in test, skipping`);

  removeRegistryScriptFolder("test");
  removeInternalRegistryJson("test");
  removePortsRegistry();
});
