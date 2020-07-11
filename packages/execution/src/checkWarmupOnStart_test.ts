import { RegistryJSONInternal } from "../deps.ts";
import { checkWarmupOnStart } from "./checkWarmupOnStart.ts";
import * as db from "./db.ts";
import { killProcess } from "./killProcess.ts";
import { assert } from "./testing/deps.ts";
import { removeScript, writeScript } from "./testing/fixtures.ts";

const registry: RegistryJSONInternal = {
  name: "test",
  port: 4000,
  warmupOnStart: true,
  whitelist: [],
  hashes: [],
};

Deno.test("should wait for creation before warming up", async () => {
  setTimeout(() => {
    writeScript("test", "");
  }, 500);

  await checkWarmupOnStart(registry);
  assert(db.isWarmedUp("test"));

  killProcess("test");
  removeScript("test");
});

Deno.test("should bail on warming up", async () => {
  await checkWarmupOnStart({ ...registry, warmupOnStart: false });
  assert(!db.isWarmedUp("test"));
});
