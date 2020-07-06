import { assertEquals, assertThrows } from "./testing/deps.ts";
import {
  addPortsRegistry,
  removePortsRegistry,
  writeRegistryJson,
  writeRegistryScriptFolder,
  removeAllScriptRelatedFiles,
} from "./testing/fixtures.ts";
import { assignPortInRegistry, basePort, maxPort } from "./assignPort.ts";
import { getScriptRegistryInternal, getPortsRegistry } from "./registry.ts";

Deno.test("should assign basePort when no other scripts are present", () => {
  writeRegistryScriptFolder("test");
  writeRegistryJson("test", `{"whitelist":[]}`);

  assignPortInRegistry("test");
  assertEquals(
    getScriptRegistryInternal("test"),
    { whitelist: [], name: "test", port: basePort },
  );

  removeAllScriptRelatedFiles("test");
});

Deno.test("should assign bumped port when other scripts are present", () => {
  addPortsRegistry(`{"test":${basePort}}`);
  writeRegistryScriptFolder("test2");
  writeRegistryJson("test2", `{"whitelist":[]}`);

  assignPortInRegistry("test2");
  assertEquals(
    getScriptRegistryInternal("test2"),
    { whitelist: [], name: "test2", port: basePort + 1 },
  );
  assertEquals(getPortsRegistry(), { test: basePort, test2: basePort + 1 });

  removeAllScriptRelatedFiles("test2");
});

Deno.test("should throw error when maxPort is reached", () => {
  addPortsRegistry(`{"test":${maxPort}}`);

  assertThrows(() => {
    assignPortInRegistry("test2");
  });

  removePortsRegistry();
});
