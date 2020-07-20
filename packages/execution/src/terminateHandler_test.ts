import { assert, assertEquals } from "../../testing/mod.ts";
import { logger } from "../deps.ts";
import * as db from "./db.ts";
import { terminateHandler } from "./terminateHandler.ts";

let a: string[] = [];
logger.setLoggingFn((...args: any[]) => (a = args));
const assertWithCleanup = (act: string) => {
  assertEquals(a[1].trim(), act);
  a = [];
};

Deno.test("should skip cold scripts", () => {
  db.set("test", {});
  terminateHandler("test", 1);
  assertWithCleanup(`Script is cold, skipping`);
});

Deno.test("should skip hot scripts not in delta", () => {
  db.set("test", { process: 1, started: Date.now() });
  terminateHandler("test", 5_000);
  assertWithCleanup(`Script is not idle, skipping`);
});

Deno.test("should terminate hot script", () => {
  const { pid: process, rid: resource } = Deno.run({
    cmd: ["deno", "repl"],
  });

  db.set("test", { process, resource, started: Date.now() - 10_000 });
  terminateHandler("test", 5000);
  assertWithCleanup(`Terminated due to idle`);
  assert(!db.isWarmedUp("script"));
});
