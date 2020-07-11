import { appendCwd, fileExists } from "../deps.ts";
import { basePort } from "./assignPort.ts";
import {
  writeRegistryScriptFolder,
  writeScript,
  testScript,
  removeInternalRegistryJson,
  removeBundle,
  removePortsRegistry,
  removeRegistryScriptFolder,
  writeRegistryJson,
} from "./testing/fixtures.ts";
import { hashIngestedScripts } from "./hashIngestedScripts.ts";
import { persistRegistryInfo } from "./persistRegistryInfo.ts";
import { assertEquals } from "./testing/deps.ts";
import { getScriptRegistryInternal, getPortsRegistry } from "./registry.ts";

Deno.test("should follow the entire registry flow", async () => {
  writeRegistryScriptFolder("test");
  writeScript(
    "test",
    testScript,
  );
  writeRegistryJson("test", `{"whitelist":[]}`);

  const hashedScripts = hashIngestedScripts(appendCwd("/registry_in"));
  await persistRegistryInfo(hashedScripts);

  assertEquals(fileExists(appendCwd("/registry/test.js")), true);
  assertEquals(fileExists(appendCwd("/registry/test.json")), true);
  assertEquals(fileExists(appendCwd("/registry/ports.json")), true);
  assertEquals(getScriptRegistryInternal("test"), {
    whitelist: [],
    name: hashedScripts[0][0],
    port: basePort,
    hashes: hashedScripts[0][1],
  });
  assertEquals(getPortsRegistry(), { test: basePort });

  removeInternalRegistryJson("test");
  removeBundle("test");
  removePortsRegistry();
  removeRegistryScriptFolder("test");
});
