import { assertEquals } from "../../testing/mod.ts";
import { raceProxyAgainstTimeout } from "./raceProxyAgainstTimeout.ts";

let t: number;

function p() {
  return new Promise<any>((resolve) => {
    t = setTimeout(() => resolve("test"), 150);
  });
}

function clT() {
  clearTimeout(t);
}

Deno.test("should let the promise win", async () => {
  const r = await raceProxyAgainstTimeout(p(), 200);
  assertEquals(r, "test");
  clT();
});

// Deno.test({
//   name: "should throw when lost",
//   async fn() {
//     assertThrowsAsync(async () => await raceProxyAgainstTimeout(p(), 100));
//     clT();
//   },
//   sanitizeOps: true,
//   sanitizeResources: true,
// });
