import { appendCwd } from "./path.ts";
import { assertEquals } from "./testing/deps.ts";

Deno.test("should respect the forward slash", () => {
  assertEquals(appendCwd(`test`), appendCwd(`/test`));
});
