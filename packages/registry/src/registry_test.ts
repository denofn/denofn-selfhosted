import {
  addPortsRegistry,
  assertEquals,
  assertThrows,
  removeInternalRegistryJson,
  removePortsRegistry,
  removeRegistryScriptFolder,
  writeInternalRegistryJson,
  writeRegistryJson,
  writeRegistryScriptFolder,
} from "../../testing/mod.ts";

import {
  REGISTRY_PORTS_PATH,
  getPortsRegistry,
  getScriptRegistryInternal,
  getScriptRegistry,
  setScriptRegistry,
} from "./registry.ts";

Deno.test("should create portregistry with empty obj if non existent", () => {
  assertEquals(getPortsRegistry(), {});
  assertEquals(JSON.parse(Deno.readTextFileSync(REGISTRY_PORTS_PATH)), {});
  removePortsRegistry();
});

Deno.test("should parse and return portregistry", () => {
  addPortsRegistry(`{"test":4000}`);
  assertEquals(getPortsRegistry(), { test: 4000 });
  removePortsRegistry();
});

Deno.test("should throw when there's no [internal] registry present", () => {
  assertThrows(() => {
    getScriptRegistryInternal("test");
  });

  assertThrows(() => {
    getScriptRegistry("test");
  });
});

Deno.test("should return parsed registry", () => {
  writeRegistryScriptFolder("test");
  writeRegistryJson("test", `{"whitelist":[]}`);
  writeInternalRegistryJson("test", `{"name":"test","whitelist":[]}`);

  assertEquals(getScriptRegistry("test"), { whitelist: [] });
  assertEquals(
    getScriptRegistryInternal("test"),
    { name: "test", whitelist: [] },
  );

  removeRegistryScriptFolder("test");
  removeInternalRegistryJson("test");
});

Deno.test("should create registry with proper data", () => {
  setScriptRegistry(
    { name: "test", port: 4000, hashes: [] },
    { whitelist: [] },
  );

  assertEquals(
    getScriptRegistryInternal("test"),
    { whitelist: [], name: "test", port: 4000, hashes: [] },
  );

  removeInternalRegistryJson("test");
});
