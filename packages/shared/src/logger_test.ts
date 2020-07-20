import { assertEquals } from "../../testing/mod.ts";
import * as logger from "./logger.ts";

let a = [];
const loggingFn = (...args: any[]) => (a = args);
logger.setLoggingFn(loggingFn);

const assertWithCleanup = (act: number, exp: number) => {
  assertEquals(act, exp);
  a = [];
};

Deno.test("should log verbosely", () => {
  // Verbose should always be true
  logger.setLogLevel("verbose");
  logger.script(`verbose`, `verbose`, "verbose");
  assertWithCleanup(a.length, 2);
  logger.script(`verbose`, `info`, "info");
  assertWithCleanup(a.length, 2);
  logger.script(`verbose`, `file`, "file");
  assertWithCleanup(a.length, 2);
});

Deno.test("should only log informatively", () => {
  // Verbose should always be true
  logger.setLogLevel("info");
  logger.script(`info`, `verbose`, "verbose");
  assertWithCleanup(a.length, 0);
  logger.script(`info`, `info`, "info");
  assertWithCleanup(a.length, 2);
  logger.script(`info`, `file`, "file");
  assertWithCleanup(a.length, 2);
});

Deno.test("should only log file related", () => {
  // Verbose should always be true
  logger.setLogLevel("file");
  logger.script(`file`, `verbose`, "verbose");
  assertWithCleanup(a.length, 0);
  logger.script(`file`, `info`, "info");
  assertWithCleanup(a.length, 0);
  logger.script(`file`, `file`, "file");
  assertWithCleanup(a.length, 2);
});
