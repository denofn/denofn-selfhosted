import { assert, removeBundle, writeBundle } from "../../testing/mod.ts";
import { RegistryJSONInternal } from "../deps.ts";
import { checkWarmupOnStart } from "./checkWarmupOnStart.ts";
import * as db from "./db.ts";
import { killProcess } from "./killProcess.ts";

const registry: RegistryJSONInternal = {
  name: "test",
  port: 4000,
  warmupOnStart: true,
  whitelist: [],
  hashes: [],
};

Deno.test("should wait for creation before warming up", async () => {
  setTimeout(() => {
    writeBundle("test", "");
  }, 500);

  await checkWarmupOnStart(registry);
  assert(db.isWarmedUp("test"));

  killProcess("test");
  removeBundle("test");
});

Deno.test("should bail on warming up", async () => {
  await checkWarmupOnStart({ ...registry, warmupOnStart: false });
  assert(!db.isWarmedUp("test"));
});
